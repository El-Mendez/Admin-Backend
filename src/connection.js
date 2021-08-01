const { Pool } = require('pg');
require('dotenv').config();

const data = process.env;
const pool = new Pool({
	host: data.DATABASE_HOST,
	password: data.DATABASE_PASSWORD,
	user: data.DATABASE_USERNAME,
	database: data.DATABASE_NAME,
});

module.exports = pool;
