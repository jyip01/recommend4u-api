const xss = require('xss')

const CommentsService = {
    postComment(db, newComment){
        return db 
            .insert(newComment)
            .into('recommend_comments')
            .returning('*')
            .then(([comment])=>comment)
    },
    updateComment(db, id, newCommentFields){
        return db('recommend_comments')
            .where({id})
            .update(newCommentFields)
            .returning('*')
    },
    deleteComment(db,id){
        return db   
            .from('recommend_comments')
            .where({id})
            .delete()
            .returning('*')
    },
    //returns comments based on the request id
    getByRequestId(db,request_id){
        return db   
            .from('recommend_comments AS comments')
            .select(
                'comments.id AS id',
                'comments.request_id AS request_id',
                'comments.user_id AS user_id',
                'comments.brand AS brand',
                'comments.why AS why',
                'users.first_name AS first_name',
                'users.last_name AS last_name'
            )
            .join('recommend_users AS users','users.id','comments.user_id')
            .where('comments.request_id',request_id)
            .orderBy('id','desc')
            
    },
    serializeComment(comment){
        return {
            id: comment.id,
            request_id: comment.request_id,
            user_id: comment.user_id,
            brand: xss(comment.brand),
            why: xss(comment.why)
        }
    },
    serializeCommentWithUser(comment){
        return {
            id: comment.id,
            request_id: comment.request_id,
            user_id: comment.user_id,
            brand: xss(comment.brand),
            why: xss(comment.why),
            first_name: xss(comment.first_name),
            last_name: xss(comment.last_name)
        }
    }
}

module.exports = CommentsService