import PocketBase from 'pocketbase';

const dbUrl = process.env.REACT_APP_DB_URL;
if (!dbUrl) {
	throw new Error('REACT_APP_DB_URL is not defined. Please check your .env file and restart the dev server.');
}
const pb = new PocketBase(dbUrl);

export default pb;