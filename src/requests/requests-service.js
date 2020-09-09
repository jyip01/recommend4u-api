const xss = require('xss')

const RequestsService={
    postRequest(db, newRequest){
        return db      
            .insert(newRequest)
            .into('recommend_requests')
            .returning('*')
            .then(([request])=>request)
    },
    getAll(db){
        return db   
            .from('recommend_requests')
            .select('*')
            .orderBy('id','desc')
    },
    //get request by id
    getById(db, id){
        return db   
            .from('recommend_requests')
            .select(
                'recommend_requests.id AS id',
                'recommend_requests.user_id AS user_id',
                'recommend_requests.product AS product',
                'recommend_requests.category AS category',
                'recommend_requests.info AS info',
                'recommend_requests.date AS date',
                'recommend_users.first_name AS first_name',
                'recommend_users.last_name AS last_name'
            )
            .join('recommend_users','recommend_users.id','recommend_requests.user_id')
            .where('recommend_requests.id',id)
            .first()
            .then((request)=>request)
    },
    updateRequest(db, id, newRequestFields){
        return db('recommend_requests')
            .where({id})
            .update(newRequestFields)
            .returning('*')
    },
    deleteRequest(db,id){
        return db   
            .from('recommend_requests')
            .where({id})
            .delete()
            .returning('*')
    },
    //get request by user id
    getByUserId(db, user_id){
        return db   
            .from('recommend_requests')
            .where('recommend_requests.user_id',user_id)
            .select('*')
            .orderBy('id','desc')
    },
    serializeRequest(request){
        return {
            id: request.id,
            user_id: request.user_id,
            product: xss(request.product),
            category: request.category,
            info: xss(request.info),
            date: request.date
        }
    },
    serializeRequestWithUser(request){
        return {
            id: request.id,
            user_id: request.user_id,
            product: xss(request.product),
            category: request.category,
            info: xss(request.info),
            date: request.date,
            first_name: request.first_name,
            last_name: request.last_name
        }
    }
}

module.exports = RequestsService;