const express = require('express')
const RequestsService = require('./requests-service')

const requestsRouter = express.Router()
const jsonBodyParser = express.json()

requestsRouter
    .route('/')
    //post a new request
    .post(jsonBodyParser,(req,res,next)=>{
        const { user_id, product, category, info, date } = req.body
        const newRequest = { user_id, product, category, info, date }

        for (const field of ['user_id','product','category','info','date'])
            if(!req.body[field])
                return res.status(400).json({
                    error: `Missing '${field}' in request body` 
                })

        return RequestsService.postRequest(
            req.app.get('db'),
            newRequest
        )
            .then(request=>{
                res
                    .status(201)
                    .json(RequestsService.serializeRequest(request))
            })
            .catch(next)
    })
    .get((req,res,next)=>{
        RequestsService.getAll(
            req.app.get('db')
        )
        .then(requests=>{
            res.json(requests.map(RequestsService.serializeRequest))
        })
        .catch(next)
    })

requestsRouter
    .route('/:request_id')
    //get specific request by its id
    .get((req,res,next)=>{
        RequestsService.getById(
            req.app.get('db'),
            req.params.request_id
        )
            .then(request=>{
                res.json(RequestsService.serializeRequestWithUser(request))
            })
            .catch((error)=>{
                console.log(error)
                next()
            })
    })
    .patch(jsonBodyParser,(req,res,next)=>{
        const { user_id, product, category, info, date } = req.body
        const requestToUpdate = { user_id, product, category, info, date }

        const numberOfValues = Object.values(requestToUpdate).filter(Boolean).length
        if(numberOfValues === 0)
            return res.status(400).json({
                error:{
                    message: `Request body must contain either 'user_id', 'product','category','info', or 'date'`
                }
            })

        RequestsService.updateRequest(
            req.app.get('db'),
            req.params.request_id,
            requestToUpdate
        )
            .then(request=>{
                res.status(200).json(RequestsService.serializeRequest(request))
            })
            .catch(next)
    })
    .delete((req,res,next)=>{
        RequestsService.deleteRequest(
            req.app.get('db'),
            req.params.request_id
        )
            .then(request=>{
                res 
                    .status(200)
                    .json([{"request":"3"}])
            })
            .catch(next)
    })

requestsRouter
    .route('/users/:user_id')
    //get all requests that were posted by a specific user
    .get((req,res,next)=>{
        RequestsService.getByUserId(
            req.app.get('db'),
            req.params.user_id
        )
            .then(requests=>{
                res.json(requests.map(RequestsService.serializeRequest))
            })
            .catch(next)
    })


module.exports = requestsRouter