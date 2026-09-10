import PocketBase from 'pocketbase';

const dbUrl = process.env.REACT_APP_DB_URL || 'https://pocketbase.ecellsoa.in';
const pb = new PocketBase(dbUrl.trim());

export default pb;