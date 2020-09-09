const express = require('express')
const CommentsService = require('./comments-service')

const commentsRouter = express.Router()
const jsonBodyParser = express.json()

commentsRouter
    .route('/')
    //post a new comment
    .post(jsonBodyParser,(req,res,next)=>{
        const { request_id, user_id, brand, why } = req.body
        const newComment = { request_id, user_id, brand, why }

        for (const field of ['request_id','user_id','brand','why'])
            if(!req.body[field])
                return res.status(400).json({
                    error: `Missing '${field}' in request body` 
                })

        return CommentsService.postComment(
            req.app.get('db'),
            newComment
        )
            .then(comment=>{
                res
                    .status(201)
                    .json(CommentsService.serializeComment(comment))
            })
            .catch(next)
    })

commentsRouter  
    .route('/:comment_id')
    //update comment
    .patch(jsonBodyParser,(req,res,next)=>{
        const { request_id, user_id, brand, why } = req.body
        const commentToUpdate = { request_id, user_id, brand, why }

        const numberOfValues = Object.values(commentToUpdate).filter(Boolean).length
        if(numberOfValues === 0)
            return res.status(400).json({
                error:{
                    message: `Request body must contain either 'request_id', 'user_id', 'brand', or 'why'`
                }
            })

        CommentsService.updateComment(
            req.app.get('db'),
            req.params.comment_id,
            commentToUpdate
        )
            .then(comment=>{
                res.status(200).json(CommentsService.serializeComment(comment))
            })
            .catch(next)
    })
    //delete comment
    .delete((req,res,next)=>{
        CommentsService.deleteComment(
            req.app.get('db'),
            req.params.comment_id
        )
            .then(comment=>{
                res
                    .status(200)
                    .json([{"comment":"3"}])
            })
            .catch(next)
    })

commentsRouter
    .route('/requests/:request_id')
    //get all comments for specific request
    .get((req,res,next)=>{
        CommentsService.getByRequestId(
            req.app.get('db'),
            req.params.request_id
        )
            .then(comments=>{
                res.json(comments.map(CommentsService.serializeCommentWithUser))
            })
            .catch(next)
    })

module.exports = commentsRouter