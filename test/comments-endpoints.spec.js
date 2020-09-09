const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Comments Endpoints',function(){

    let db 

    const testUsers = helpers.makeUsersArray()
    const testUser = testUsers[0]
    const testRequests = helpers.makeRequestsArray()
    const testRequest = testRequests[0]
    const testComments = helpers.makeCommentsArray()
    const testComment = testComments[0]

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

    describe(`POST /api/comments`, () => {
        
        context(`Request Validation`, () => {
            
            beforeEach('insert users',()=>
                helpers.seedUsers(db, testUsers) 
            )
            beforeEach('insert requests',()=>
                helpers.seedRequests(db, testRequests) 
            )
            beforeEach('insert comments',()=>
                helpers.seedComments(db, testComments) 
            )
    
          const requiredFields = ['request_id','user_id','brand','why']
    
          requiredFields.forEach(field => {
            const postAttemptBody = {
              request_id: 1,
              user_id: 1,
              brand: 'test brand',
              why: 'test why'
            }
    
            it(`responds with 400 required error when '${field}' is missing`, () => {
              delete postAttemptBody[field]
    
              return supertest(app)
                .post('/api/comments')
                .send(postAttemptBody)
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
            beforeEach('insert requests',()=>
                helpers.seedRequests(db, testRequests) 
            )
            beforeEach('insert comments',()=>
                helpers.seedComments(db, testComments) 
            )

          it(`responds 201, serialized comment`, () => {
            const newComment = {
                request_id: 1,
                user_id: 1,
                brand: 'test brand',
                why: 'test why'
            }
            return supertest(app)
              .post('/api/comments')
              .send(newComment)
              .expect(201)
              .expect(res => {
                expect(res.body).to.have.property('id')
                expect(res.body.request_id).to.eql(newComment.request_id)
                expect(res.body.user_id).to.eql(newComment.user_id)
                expect(res.body.brand).to.eql(newComment.brand)
                expect(res.body.why).to.eql(newComment.why)
              })
              .expect(res =>
                db
                  .from('recommend_comments')
                  .select('*')
                  .where({ id: res.body.id })
                  .first()
                  .then(row => {
                    expect(row.request_id).to.eql(newComment.request_id)
                    expect(row.user_id).to.eql(newComment.user_id)
                    expect(row.brand).to.eql(newComment.brand)
                    expect(row.why).to.eql(newComment.why)
                  })
              )
          })
        })
      
    })

    describe(`PATCH /api/comments/:comment_id`,()=>{
        context('Given there are comments in the database',()=>{
        
            beforeEach('insert users',()=>
                helpers.seedUsers(db, testUsers) 
            )
            beforeEach('insert requests',()=>
                helpers.seedRequests(db, testRequests) 
            )
            beforeEach('insert comments',()=>
                helpers.seedComments(db, testComments) 
            )
    
            it('responds with 200',()=>{
              const idToUpdate = 1
              const updateComment = {
                id: 1,
                request_id: 1,
                user_id: 1, 
                brand: 'Nike',
                why: 'They look so cool and are comfy.'

              }
              return supertest(app)
                .patch(`/api/comments/${idToUpdate}`)
                .send(updateComment)
                .expect(200)
            })
    
            it(`responds with 400 when no required fields supplied`,()=>{
              const idToUpdate = 1
              return supertest(app)
                .patch(`/api/comments/${idToUpdate}`)
                .send({ irrelevantField: 'foo' })
                .expect(400, {
                  error: {
                    message: `Request body must contain either 'request_id', 'user_id', 'brand', or 'why'`
                  }
              })
            })
    
            it(`responds with 200 when updating only a subset of fields`, () => {
              const idToUpdate = 1
              const updateComment= {
                brand:'Sketchers',
              }
      
              return supertest(app)
                .patch(`/api/comments/${idToUpdate}`)
                .send({
                  ...updateComment,
                  fieldToIgnore: 'should not be in GET response'
                })
                .expect(200)
            })
    
          })
    })

    describe(`DELETE /api/comments/:comment_id`,()=>{
        context(`Given there is a request with the correct id`,()=>{
            
            beforeEach('insert users',()=>
                helpers.seedUsers(db, testUsers) 
            )
            beforeEach('insert requests',()=>
                helpers.seedRequests(db, testRequests) 
            )
            beforeEach('insert comments',()=>
                helpers.seedComments(db, testComments) 
            )

            it(`responds with 200`,()=>{
              const commentId = 1
    
              return supertest(app)
                .delete(`/api/comments/${commentId}`)
                .expect(200,[{"comment":"3"}])
            })
          })
    })

    describe(`GET /api/comments/requests/:request_id`,()=>{
        context('Given there are comments in the database',()=>{
            beforeEach('insert users',()=>
                helpers.seedUsers(db, testUsers) 
            )
            beforeEach('insert requests',()=>
                helpers.seedRequests(db, testRequests) 
            )
            beforeEach('insert comments',()=>
                helpers.seedComments(db, testComments) 
            )

            it(`responds with 200 and the correct comments`,()=>{
                const requestId = 1
                const expectedResult = helpers.makeCommentsArrayWithUser().reverse()
                return supertest(app)
                    .get(`/api/comments/requests/${requestId}`)
                    .expect(200,expectedResult)
            })
        })
    })

})