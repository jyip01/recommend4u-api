const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Requests Endpoints',function(){
    let db 

    const testUsers = helpers.makeUsersArray()
    const testUser = testUsers[0]
    const testRequests = helpers.makeRequestsArray()
    const testRequest = testRequests[0]

    before('make knex instance', () => {
        db = knex({
          client: 'pg',
          connection: process.env.TEST_DB_URL,
        })
        app.set('db', db)
      })
    
    after('disconnect from db', () => db.destroy())
    
    before('cleanup', () => helpers.cleanTables(db))
    
    afterEach('cleanup', () => helpers.cleanTables(db))

    describe(`GET /api/requests`,()=>{
        context(`Given no requests`,()=>{
            it(`responds with 200 and an empty list`,()=>{
                return supertest(app)
                    .get('/api/requests')
                    .expect(200,[])
            })
        })

        context(`Given there are requests in the database`,()=>{
            beforeEach('insert users',()=>
                helpers.seedUsers(db, testUsers) 
            )
            beforeEach('insert requests',()=>
                helpers.seedRequests(db, testRequests) 
            )

            console.log(testRequests)
            
            it(`responds with 200 and all of the requests`,()=>{
                const expectedRequests = testRequests.reverse() //requests should be returned in descending order
                return supertest(app)
                    .get('/api/requests')
                    .expect(200,expectedRequests)
            })
        })

        context(`Given an XSS attack request`,()=>{
            beforeEach('insert users',()=>
                helpers.seedUsers(db, testUsers) 
            )

            const {
                maliciousRequest,
                expectedRequest,
            } = helpers.makeMaliciousRequest()

            beforeEach('insert malicious request', () => {
                return helpers.seedMaliciousRequest(
                  db,
                  maliciousRequest
                )
            })

            it('removes XSS attack content',()=>{
                return supertest(app)
                    .get(`/api/requests`)
                    .expect(200)
                    .expect(res=>{
                        expect(res.body[0].product).to.eql(expectedRequest.product)
                        expect(res.body[0].info).to.eql(expectedRequest.info)
                    })
            })

        })
    })

    describe(`POST /api/requests`, () => {
        
        context(`Request Validation`, () => {
            
            beforeEach('insert users',()=>
                helpers.seedUsers(db, testUsers) 
            )
            beforeEach('insert requests',()=>
                helpers.seedRequests(db, testRequests) 
            )
    
          const requiredFields = ['user_id','product','category','info','date']
    
          requiredFields.forEach(field => {
            const registerAttemptBody = {
              user_id: 1,
              product: 'test product',
              category: 'test category',
              info: 'test info',
              date: '2020-02-02T00:00:00.000Z',
            }
    
            it(`responds with 400 required error when '${field}' is missing`, () => {
              delete registerAttemptBody[field]
    
              return supertest(app)
                .post('/api/requests')
                .send(registerAttemptBody)
                .expect(400, {
                  error: `Missing '${field}' in request body`,
                })
            })
          })
    
        })

        context(`Happy path`, () => {

            beforeEach('insert users',()=>
                helpers.seedUsers(db, testUsers) 
            )

            console.log(testUsers)


          it(`responds 201, serialized request`, () => {
            const newRequest = {
              user_id: 1,
              product: 'test product',
              category: 'test category',
              info: 'test info',
              date: '2020-02-02T00:00:00.000Z',
            }
            return supertest(app)
              .post('/api/requests')
              .send(newRequest)
              .expect(201)
              .expect(res => {
                expect(res.body).to.have.property('id')
                expect(res.body.user_id).to.eql(newRequest.user_id)
                expect(res.body.product).to.eql(newRequest.product)
                expect(res.body.category).to.eql(newRequest.category)
                expect(res.body.info).to.eql(newRequest.info)
                expect(res.body.date).to.eql(newRequest.date)
              })
              .expect(res =>
                db
                  .from('recommend_requests')
                  .select('*')
                  .where({ id: res.body.id })
                  .first()
                  .then(row => {
                    expect(row.user_id).to.eql(newRequest.id)
                    expect(row.product).to.eql(newRequest.product)
                    expect(row.category).to.eql(newRequest.category)
                    expect(row.info).to.eql(newRequest.info)
                    expect(row.date).to.eql(newRequest.date)
                  })
              )
          })
        })
      
    })

    describe(`GET /api/requests/:request_id`,()=>{
        
        context('Given there are requests in the database',()=>{
            beforeEach('insert users',()=>
                helpers.seedUsers(db, testUsers) 
            )
            beforeEach('insert requests',()=>
                helpers.seedRequests(db, testRequests) 
            )

            it(`responds with 200 and the correct request`,()=>{
                const requestId = 1
                const expectedResult = helpers.makeExpectedRequestWithUser()

                return supertest(app)
                    .get(`/api/requests/${requestId}`)
                    .expect(200,expectedResult)
            })
        })
    })

    describe(`PATCH /api/requests/:request_id`,()=>{
        context('Given there are requests in the database',()=>{
        
            beforeEach('insert users',()=>
                helpers.seedUsers(db, testUsers) 
            )
            beforeEach('insert requests',()=>
                helpers.seedRequests(db, testRequests) 
            )
    
            it('responds with 200',()=>{
              const idToUpdate = 1
              const updateRequest = {
                user_id: 1, 
                product: 'Gym Shoes',
                category: 'Clothing & Shoes',
                info: 'I run on pavement so must have lots of cushioning.',
                date: '2020-02-02T00:00:00.000Z'
              }
              return supertest(app)
                .patch(`/api/requests/${idToUpdate}`)
                .send(updateRequest)
                .expect(200)
            })
    
            it(`responds with 400 when no required fields supplied`,()=>{
              const idToUpdate = 1
              return supertest(app)
                .patch(`/api/requests/${idToUpdate}`)
                .send({ irrelevantField: 'foo' })
                .expect(400, {
                  error: {
                    message: `Request body must contain either 'user_id', 'product','category','info', or 'date'`
                  }
              })
            })
    
            it(`responds with 200 when updating only a subset of fields`, () => {
              const idToUpdate = 1
              const updateReminder= {
                product:'Sneakers',
              }
      
              return supertest(app)
                .patch(`/api/requests/${idToUpdate}`)
                .send({
                  ...updateReminder,
                  fieldToIgnore: 'should not be in GET response'
                })
                .expect(200)
            })
    
          })
    })

    describe(`DELETE /api/requests/:request_id`,()=>{
        context(`Given there is a request with the correct id`,()=>{
            
            beforeEach('insert users',()=>
                helpers.seedUsers(db, testUsers) 
            )
            beforeEach('insert requests',()=>
                helpers.seedRequests(db, testRequests) 
            )

            it(`responds with 200`,()=>{
              const requestId = 1
    
              return supertest(app)
                .delete(`/api/requests/${requestId}`)
                .expect(200,[{"request":"3"}])
            })
          })
    })

    describe(`GET /api/requests/users/:user_id`,()=>{
        context('Given there are requests in the database',()=>{
            beforeEach('insert users',()=>
                helpers.seedUsers(db, testUsers) 
            )
            beforeEach('insert requests',()=>
                helpers.seedRequests(db, testRequests) 
            )

            it(`responds with 200 and the correct requests`,()=>{
                const userId = 2
                const expectedResult = helpers.makeExpectedRequestListForUser2().reverse()
                return supertest(app)
                    .get(`/api/requests/users/${userId}`)
                    .expect(200,expectedResult)
            })
        })
    })

})