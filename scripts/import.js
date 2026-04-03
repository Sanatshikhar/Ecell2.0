const PocketBase = require('pocketbase/cjs');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const dotenv = require('dotenv');

const ROOT_ENV_PATH = path.resolve(__dirname, '..', '.env');
if (fs.existsSync(ROOT_ENV_PATH)) {
  dotenv.config({ path: ROOT_ENV_PATH });
} else {
  dotenv.config({ path: path.resolve(process.cwd(), '.env') });
}

const PB_URL = process.env.PB_URL || process.env.REACT_APP_DB_URL;
const PB_ADMIN_EMAIL = process.env.PB_ADMIN_EMAIL;
const PB_ADMIN_PASSWORD = process.env.PB_ADMIN_PASSWORD;
const COLLECTION = process.env.PB_IMPORT_COLLECTION || 'scratchlabsRegistrations';
const CSV_PATH = process.env.PB_IMPORT_CSV_PATH || "C:\\Users\\Sujay\\Downloads\\Untitled spreadsheet - Sheet1.csv";

if (!PB_URL) {
  throw new Error('Missing PocketBase URL. Set PB_URL or REACT_APP_DB_URL in .env.');
}

const pb = new PocketBase(PB_URL.trim());

function toNumberOrNull(value) {
  if (value === undefined || value === null) return null;
  const normalized = String(value).replace(/,/g, '').trim();
  if (!normalized) return null;

  const parsed = Number(normalized);
  if (Number.isFinite(parsed)) {
    return Math.trunc(parsed);
  }

  const digits = String(value).replace(/\D/g, '').trim();
  if (!digits) return null;
  const fallback = Number(digits);
  if (!Number.isFinite(fallback)) return null;
  if (fallback <= Number.MAX_SAFE_INTEGER) return fallback;
  return digits;
}

function getField(row, ...keys) {
  for (const key of keys) {
    if (!Object.prototype.hasOwnProperty.call(row, key)) continue;
    const value = row[key];
    if (value === undefined || value === null) continue;
    const text = String(value).trim();
    if (text !== '') return text;
  }
  return '';
}

function toBool(value) {
  const normalized = String(value || '').trim().toLowerCase();
  if (['yes', 'true', '1', 'y'].includes(normalized)) return true;
  if (['no', 'false', '0', 'n', ''].includes(normalized)) return false;
  return false;
}

function normalizeEmail(value) {
  return String(value || '').trim().toLowerCase();
}

function normalizeRegNum(value) {
  return String(value || '').trim().toUpperCase();
}

function mapCsvRow(row) {
  const registrationType = getField(row, 'registrationType', 'Registration Type') || 'Individual';
  const experience = getField(row, 'experience', 'Experience') || 'No';

  return {
    fullName: getField(row, 'fullName', 'Full Name', 'name', 'Member 1 Name'),
    regNum: normalizeRegNum(getField(row, 'regNum', 'Reg Num', 'regNo', 'Member 1 RegNum')),
    contact: toNumberOrNull(getField(row, 'contact', 'Contact', 'phone', 'Member 1 Contact')),
    arrived: toBool(getField(row, 'arrived', 'Arrived')),
    year: getField(row, 'year', 'Year', 'Member 1 Year'),
    branch: getField(row, 'branch', 'Branch', 'course', 'Member 1 Branch'),
    email: normalizeEmail(getField(row, 'email', 'Email', 'Member 1 Email')),
    registrationType,
    experience,
    teammateName: getField(row, 'teammateName', 'Teammate Name', 'Member 2 Name'),
    teammateRegNum: normalizeRegNum(getField(row, 'teammateRegNum', 'Teammate Reg Num', 'Member 2 RegNum')),
    teammateYear: getField(row, 'teammateYear', 'Teammate Year', 'Member 2 Year'),
    teammateBranch: getField(row, 'teammateBranch', 'Teammate Branch', 'Member 2 Branch'),
    teammateContact: toNumberOrNull(getField(row, 'teammateContact', 'Teammate Contact', 'Member 2 Contact')),
    teammateEmail: normalizeEmail(getField(row, 'teammateEmail', 'Teammate Email', 'Member 2 Email')),
    teammateArrived: toBool(getField(row, 'teammateArrived', 'Teammate Arrived')),
  };
}

async function getExistingKeys() {
  const existingRecords = await pb.collection(COLLECTION).getFullList({
    fields: 'regNum,email',
  });

  const existingRegNums = new Set();
  const existingEmails = new Set();

  for (const record of existingRecords) {
    const regNum = normalizeRegNum(record.regNum);
    const email = normalizeEmail(record.email);
    if (regNum) existingRegNums.add(regNum);
    if (email) existingEmails.add(email);
  }

  return { existingRegNums, existingEmails };
}

function readCsvRows(filePath) {
  return new Promise((resolve, reject) => {
    const rows = [];

    if (!fs.existsSync(filePath)) {
      reject(new Error(`CSV file not found: ${filePath}`));
      return;
    }

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => rows.push(row))
      .on('end', () => resolve(rows))
      .on('error', reject);
  });
}

async function authenticateIfConfigured() {
  if (!PB_ADMIN_EMAIL || !PB_ADMIN_PASSWORD) {
    console.warn('PB_ADMIN_EMAIL/PB_ADMIN_PASSWORD not set. Import will rely on collection API rules.');
    return;
  }

  try {
    await pb.collection('_superusers').authWithPassword(PB_ADMIN_EMAIL, PB_ADMIN_PASSWORD);
    console.log('Authenticated as PocketBase superuser.');
  } catch (error) {
    throw new Error(`PocketBase auth failed: ${error?.message || 'unknown error'}`);
  }
}

async function importData() {
  try {
    await authenticateIfConfigured();

    const records = await readCsvRows(CSV_PATH);
    const { existingRegNums, existingEmails } = await getExistingKeys();
    console.log(`Found ${records.length} records in ${CSV_PATH}. Starting import to ${COLLECTION}...`);
    console.log(`Existing records loaded. RegNums: ${existingRegNums.size}, Emails: ${existingEmails.size}`);

    let success = 0;
    let failed = 0;
    let skippedExisting = 0;

    for (let i = 0; i < records.length; i += 1) {
      const record = records[i];
      const dataToInsert = mapCsvRow(record);

      if (!dataToInsert.fullName || !dataToInsert.regNum || !dataToInsert.email) {
        failed += 1;
        console.error('Skipped row: missing required fields (fullName/regNum/email).', record);
        continue;
      }

      if (existingRegNums.has(dataToInsert.regNum) || existingEmails.has(dataToInsert.email)) {
        skippedExisting += 1;
        console.log(`Skipped existing: ${dataToInsert.fullName} (${dataToInsert.email}, ${dataToInsert.regNum})`);
        continue;
      }

      try {
        await pb.collection(COLLECTION).create(dataToInsert);
        success += 1;
        existingRegNums.add(dataToInsert.regNum);
        existingEmails.add(dataToInsert.email);
        console.log(`Imported: ${dataToInsert.fullName} (${dataToInsert.email})`);
      } catch (error) {
        failed += 1;
        console.error(`Failed to import ${dataToInsert.fullName || 'unknown'}:`, error?.message || error);
      }
    }

    console.log(`Import complete. Success: ${success}, Skipped existing: ${skippedExisting}, Failed: ${failed}`);
  } catch (error) {
    console.error('Import failed:', error?.message || error);
    process.exitCode = 1;
  }
}

importData();
