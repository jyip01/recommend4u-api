require('dotenv').config()

const knex = require('knex')
const app = require('./app')
const { PORT, DATABASE_URL } = require('./config')
console.log(DATABASE_URL, "###############");
const db = knex({
  client: 'pg',
  connection: DATABASE_URL,
  /*connection: {
    host : '127.0.0.1',
    user : 'jyip',
    password : '1234',
    database : 'recommend'
  }*/
})

app.set('db', db)

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})