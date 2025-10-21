const { body } = require('express-validator')

const registerValidation = [
    body('email').isEmail().withMessage("Неверный формат email"),
    body('password')
        .isLength({ min: 6 })
        .withMessage("Пароль должен быть минимум 6 символов"),
    body('name')
        .isLength({ min: 3 })
        .withMessage("Никнейм должен быть минимум 3 символа")
]

module.exports = registerValidation