const PocketBase = require('pocketbase/cjs');
const readline = require('readline');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env if present
const ROOT_ENV_PATH = path.resolve(__dirname, '..', '.env');
if (fs.existsSync(ROOT_ENV_PATH)) {
  dotenv.config({ path: ROOT_ENV_PATH });
} else {
  dotenv.config({ path: path.resolve(process.cwd(), '.env') });
}

const PB_URL = process.env.PB_URL || process.env.REACT_APP_DB_URL || 'https://pocketbase.ecellsoa.in';
const COLLECTION_NAME = process.env.REACT_APP_ORIENTATION_COLLECTION || 'registrations';

function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => rl.question(query, (ans) => {
    rl.close();
    resolve(ans.trim());
  }));
}

async function main() {
  console.log('========================================================');
  console.log(' PocketBase Collection Setup: ' + COLLECTION_NAME);
  console.log(' Target Server: ' + PB_URL);
  console.log('========================================================\n');

  let adminEmail = process.env.PB_ADMIN_EMAIL;
  let adminPassword = process.env.PB_ADMIN_PASSWORD;

  if (!adminEmail) {
    adminEmail = await askQuestion('Enter PocketBase Superuser / Admin Email: ');
  }
  if (!adminPassword) {
    adminPassword = await askQuestion('Enter PocketBase Superuser / Admin Password: ');
  }

  if (!adminEmail || !adminPassword) {
    console.error('Error: Email and password are required.');
    process.exit(1);
  }

  const pb = new PocketBase(PB_URL.trim());

  // 1. Authenticate as Superuser / Admin
  console.log('\nAuthenticating with PocketBase...');
  let isSuperuser = false;
  try {
    // PocketBase v0.23+
    await pb.collection('_superusers').authWithPassword(adminEmail, adminPassword);
    isSuperuser = true;
    console.log('✓ Successfully authenticated as Superuser (PocketBase v0.23+).');
  } catch (err1) {
    try {
      // Fallback for PocketBase < v0.23
      if (pb.admins && typeof pb.admins.authWithPassword === 'function') {
        await pb.admins.authWithPassword(adminEmail, adminPassword);
        console.log('✓ Successfully authenticated as Admin (PocketBase legacy).');
      } else {
        throw err1;
      }
    } catch (err2) {
      console.error('\n✗ Authentication failed:');
      console.error(err1.message || err2.message || err1);
      process.exit(1);
    }
  }

  // 2. Check if collection already exists
  let existingCollection = null;
  try {
    existingCollection = await pb.collections.getOne(COLLECTION_NAME);
    console.log(`\nNotice: Collection '${COLLECTION_NAME}' already exists (ID: ${existingCollection.id}).`);
  } catch (e) {
    // Collection doesn't exist, will create
  }

  // Fields definition for the collection
  // PocketBase v0.23+ expects 'fields', earlier versions accept 'schema'
  const fieldsConfig = [
    { name: 'name', type: 'text', required: true },
    { name: 'registration_number', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'phone', type: 'text', required: true },
    { name: 'branch', type: 'text', required: true },
    { name: 'section', type: 'text', required: true },
    { name: 'year', type: 'text', required: true },
    { name: 'team', type: 'text', required: true },
    {
      name: 'idProof',
      type: 'file',
      required: false,
      maxSelect: 1,
      maxSize: 5242880,
      mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'],
    },
    { name: 'mailSent', type: 'bool', required: false },
  ];

  const indexesConfig = [
    `CREATE UNIQUE INDEX idx_${COLLECTION_NAME}_email ON ${COLLECTION_NAME} (email)`,
    `CREATE UNIQUE INDEX idx_${COLLECTION_NAME}_reg ON ${COLLECTION_NAME} (registration_number)`,
  ];

  const collectionData = {
    name: COLLECTION_NAME,
    type: 'base',
    createRule: '', // Public access: Anyone can submit registration
    listRule: '@request.auth.id != ""', // Protected: Only authenticated users/admins can list all data
    viewRule: '@request.auth.id != ""', // Protected: Only authenticated users/admins can view individual records
    updateRule: null, // Protected: Admin only
    deleteRule: null, // Protected: Admin only
    fields: fieldsConfig,
    schema: fieldsConfig, // for backwards-compatibility
    indexes: indexesConfig,
  };

  try {
    if (existingCollection) {
      console.log(`Updating existing '${COLLECTION_NAME}' collection rules and schema...`);
      // Update rules so createRule is public
      const updated = await pb.collections.update(existingCollection.id, {
        createRule: '',
        listRule: existingCollection.listRule || '@request.auth.id != ""',
        viewRule: existingCollection.viewRule || '@request.auth.id != ""',
      });
      console.log(`✓ Collection '${COLLECTION_NAME}' updated successfully!`);
      console.log(`  - Create Rule: PUBLIC (Anyone can submit)`);
      console.log(`  - List/View Rule: Protected`);
    } else {
      console.log(`Creating collection '${COLLECTION_NAME}'...`);
      const created = await pb.collections.create(collectionData);
      console.log(`\n🎉 Collection '${COLLECTION_NAME}' created successfully! (ID: ${created.id})`);
      console.log(`  - Name: ${created.name}`);
      console.log(`  - Type: ${created.type}`);
      console.log(`  - Create Rule: PUBLIC (Anyone can register)`);
      console.log(`  - Fields: name, registration_number, email, phone, branch, section, year, team, mailSent`);
      console.log(`  - Indexes: Unique on email and registration_number`);
    }

    console.log('\n========================================================');
    console.log('✓ All set! Your frontend form is ready to submit.');
    console.log('========================================================\n');
  } catch (err) {
    console.error('\n✗ Failed to create/update collection:');
    console.error(err.message || err);
    if (err.data) {
      console.error('Details:', JSON.stringify(err.data, null, 2));
    }
    process.exit(1);
  }
}

main();
