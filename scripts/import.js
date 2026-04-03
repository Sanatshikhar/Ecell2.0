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
const COLLECTION = process.env.PB_IMPORT_COLLECTION || 'scratchlabs_teams';
const CSV_PATH = "C:\\Users\\Sujay\\Downloads\\ScratchLab - Teamwise List.csv";

if (!PB_URL) {
  throw new Error('Missing PocketBase URL. Set PB_URL or REACT_APP_DB_URL in .env.');
}

const pb = new PocketBase(PB_URL.trim());

function toNumberOrNull(value) {
  if (value === undefined || value === null) return null;
  const digits = String(value).replace(/[^0-9.]/g, '').trim();
  if (!digits) return null;
  const parsed = Number(digits);
  return Number.isFinite(parsed) ? parsed : null;
}

function mapCsvRow(row, index) {
  const teamName = `TEAM-${String(index + 1).padStart(2, '0')}`;
  return {
    team_name: teamName,
    m1_name: row['Member 1 Name'] || row.m1_name || '',
    m1_branch: row['Member 1 Branch'] || row.m1_branch || '',
    m1_contact: toNumberOrNull(row['Member 1 Contact'] || row.m1_contact),
    m1_year: row['Member 1 Year'] || row.m1_year || '',
    m1_email: row['Member 1 Email'] || row.m1_email || '',
    m1_regNo: row['Member 1 RegNum'] || row.m1_regNo || '',
    m2_name: row['Member 2 Name'] || row.m2_name || '',
    m2_branch: row['Member 2 Branch'] || row.m2_branch || '',
    m2_year: row['Member 2 Year'] || row.m2_year || '',
    m2_contact: toNumberOrNull(row['Member 2 Contact'] || row.m2_contact),
    m2_email: row['Member 2 Email'] || row.m2_email || '',
    m2_regNo: row['Member 2 RegNum'] || row.m2_regNo || '',
    team_type: row['Team Type'] || row.team_type || 'Existing Team',
  };
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
    console.log(`Found ${records.length} records in ${CSV_PATH}. Starting import to ${COLLECTION}...`);

    let success = 0;
    let failed = 0;

    for (let i = 0; i < records.length; i += 1) {
      const record = records[i];
      const dataToInsert = mapCsvRow(record, i);

      if (!dataToInsert.m1_email) {
        failed += 1;
        console.error('Skipped row: missing Member 1 Email.', record);
        continue;
      }

      try {
        await pb.collection(COLLECTION).create(dataToInsert);
        success += 1;
        console.log(`Imported: ${dataToInsert.team_name} (${dataToInsert.m1_email})`);
      } catch (error) {
        failed += 1;
        console.error(`Failed to import ${dataToInsert.team_name}:`, error?.message || error);
      }
    }

    console.log(`Import complete. Success: ${success}, Failed: ${failed}`);
  } catch (error) {
    console.error('Import failed:', error?.message || error);
    process.exitCode = 1;
  }
}

importData();
