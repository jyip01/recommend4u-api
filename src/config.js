module.exports = {
  PORT: process.env.PORT || 8052,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://jessica_yip:1234@localhost/recommend',
  JWT_SECRET: process.env.JWT_SECRET || 'change-this-secret',
}