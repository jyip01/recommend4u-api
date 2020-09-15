module.exports = {
  PORT: process.env.PORT || 8052,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL || 'postgres://jxjokqmyabewpq:7500af1eaace515bd87935a779e1ebaf8d2f2b43e6fc65035818ca79fa77f2e1@ec2-184-72-235-80.compute-1.amazonaws.com:5432/d6nm2duhanh0cb',
  JWT_SECRET: process.env.JWT_SECRET || 'change-this-secret',
}