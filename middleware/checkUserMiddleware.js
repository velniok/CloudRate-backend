const jwt = require('jsonwebtoken')
require('dotenv').config();

const checkUserMiddleware = (req, res, next) => {
    try {
        const token = (req.headers.authorization || '').replace(/Bearer\s?/, '')
        if (!token) {
            return res.status(401).json({ message: 'Не авторизован' })
        }
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET_KEY)
        if (decoded._id !== req.params.id) {
            return res.status(403).json({ message: 'Нет доступа' })
        }
        next()
    } catch (err) {
        res.status(401).json({ message: 'Не авторизован' })
    }
}

module.exports = checkUserMiddleware