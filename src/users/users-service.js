const xss = require('xss')
const bcrypt = require('bcryptjs')

const UsersService = {
    insertUser(db, newUser){
        return db
            .insert(newUser)
            .into('recommend_users')
            .returning('*')
            .then(([user])=>user)
    },
    validatePassword(password){
        const REGEX_UPPER_LOWER_NUMBER = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[\S]+/

        if (password.length < 8) {
            return 'Password must be longer than 8 characters'
        }
        if (password.length > 72) {
            return 'Password must be less than 72 characters'
        }
        if (password.startsWith(' ') || password.endsWith(' ')) {
            return 'Password must not start or end with empty spaces'
        }
        if (!REGEX_UPPER_LOWER_NUMBER.test(password)) {
            return 'Password must contain one upper case, lower case, and number'
        }
        return null
    },
    hashPassword(password) {
        return bcrypt.hash(password, 12)
    },
    hasUserWithEmail(db, email) {
        return db('recommend_users')
          .where({ email })
          .first()
          .then(user => !!user)
    },
    serializeUser(user){
        return {
            id: user.id,
            first_name: xss(user.first_name),
            last_name: xss(user.last_name),
            email: xss(user.email)
        }
    }
}

module.exports = UsersService