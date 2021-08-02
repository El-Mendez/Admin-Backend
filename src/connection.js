const { Pool } = require('pg');
const CONSTANTS = require('./CONSTANTS');

const pool = new Pool({
  host: CONSTANTS.host,
  password: CONSTANTS.password,
  user: CONSTANTS.user,
  database: CONSTANTS.database,
});

module.exports = pool;
