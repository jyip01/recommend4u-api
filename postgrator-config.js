require('dotenv').config();
console.log(process.env.TEST_DATABASE_URL);

module.exports = {
  "migrationDirectory": "migrations",
  "driver": "pg",
  "role": "jyip",
  "db": "recommend_test",
  "connectionString": (process.env.NODE_ENV === 'test')
    ? "postgresql://jyip:1234@localhost/recommend_test"
    : "postgresql://jessica_yip:1234@localhost/recommend",
  "ssl": !!process.env.SSL,
}
