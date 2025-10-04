const jwt = require('jsonwebtoken')
require('dotenv').config();

const checkAuthMiddleware = (req, res, next) => {
    try {
        const token = (req.headers.authorization || '').replace(/Bearer\s?/, '')
        if (!token) {
            return res.status(401).json({ message: 'Не авторизован' })
        }
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET_KEY)
        req.userId = decoded._id
        next()
    } catch (err) {
        res.status(401).json({ message: 'Не авторизован' })
    }
}

module.exports = checkAuthMiddleware