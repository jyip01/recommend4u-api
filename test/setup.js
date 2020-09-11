process.env.TZ = 'UCT'
process.env.NODE_ENV = 'test'
process.env.JWT_SECRET = 'auth-test-secret'

require('dotenv').config()

process.env.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL
  || "postgresql://jyip:1234@localhost/recommend_test"

const { expect } = require('chai')
const supertest = require('supertest')

global.expect = expect
global.supertest = supertest
