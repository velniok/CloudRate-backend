const jwt = require('jsonwebtoken')

const checkAdminMiddleware = (req, res, next) => {
    try {
        const token = (req.headers.authorization || '').replace(/Bearer\s?/, '')
        if (!token) {
            return res.status(401).json({ message: 'Не авторизован' })
        }
        const decoded = jwt.verify(token, 'secret123')
        if (decoded.role !== 'admin') {
            return res.status(403).json({ message: 'Нет доступа' })
        }
        next()
    } catch (err) {
        res.status(401).json({ message: 'Не авторизован' })
    }
}

module.exports = checkAdminMiddleware