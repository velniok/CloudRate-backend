const { body } = require('express-validator')

class ArtistValidation {

    artistCreateValidation = [
        body('name')
            .exists({ checkFalsy: true })
            .withMessage("Введите никнейм артиста"),
        body('avatarUrl')
            .exists({ checkFalsy: true }).withMessage("Загрузите аватарку артиста"),
        body('soundCloudUrl')
            .exists({ checkFalsy: true }).withMessage("Введите ссылку на артиста")
            .isURL().withMessage("Неверный формат ссылки"),
    ]

    artistEditValidation = [
        body('name')
            .exists({ checkFalsy: true })
            .withMessage("Введите никнейм артиста"),
        body('avatarUrl')
            .exists({ checkFalsy: true }).withMessage("Загрузите аватарку артиста"),
        body('soundCloudUrl')
            .exists({ checkFalsy: true }).withMessage("Введите ссылку на артиста")
            .isURL().withMessage("Неверный формат ссылки"),
    ]

}


module.exports = new ArtistValidation()