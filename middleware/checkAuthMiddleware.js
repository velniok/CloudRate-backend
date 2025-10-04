const jwt = require('jsonwebtoken')

const checkAuthMiddleware = (req, res, next) => {
    try {
        const token = (req.headers.authorization || '').replace(/Bearer\s?/, '')
        if (!token) {
            return res.status(401).json({ message: 'Не авторизован' })
        }
        const decoded = jwt.verify(token, 'secret123')
        req.userId = decoded._id
        next()
    } catch (err) {
        res.status(401).json({ message: 'Не авторизован' })
    }
}

module.exports = checkAuthMiddleware