const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')

const protect = asyncHandler(async (req, res, next) => {
    let token

    // Verify if request has "authorization: Bearer xxxxx" header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get Bearer token from header
            token = req.headers.authorization.split(' ')[1]

            // Decode token to retrieve user id
            const decoded = jwt.verify(token, process.env.FAKE_KEY)

            // Verify if user with this id still exists
            let isExist = await User.exists({'_id': decoded.id})
            if (isExist) {
                req.user = decoded.id
                next()
            }
        } catch (e) {
            console.log(e)
            res.status(401)
            throw new Error('Not authorized')
        }
    }

    if (!token) {
        res.status(401)
        throw new Error('Not authorized, no token')
    }
})


module.exports = {protect}