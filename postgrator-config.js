require('dotenv').config();

const config = require('./src/config');
//const setup = require('./test/setup');

module.exports = {
  "migrationDirectory": "migrations",
  "driver": "pg",
  "role": "jyip",
  "db": "recommend_test",
  /*"connectionString": (process.env.NODE_ENV === 'test')
    ? "postgresql://jyip:1234@localhost/recommend_test"
    : "postgresql://jessica_yip:1234@localhost/recommend",*/
    "connectionString": (process.env.NODE_ENV === 'test') 
    ? config.TEST_DATABASE_URL 
    : config.DATABASE_URL,
}
