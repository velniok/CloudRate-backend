const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { validationResult } = require('express-validator')
const UserModel = require('../models/User')
require('dotenv').config();

class UserController {
    async register(req, res) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json(errors.array())
            }

            const password = req.body.password
            const salt = await bcrypt.genSalt(10)
            const passwordHash = await bcrypt.hash(password, salt)

            const doc = new UserModel({
                email: req.body.email,
                nickname: req.body.nickname,
                avatarUrl: req.body.avatarUrl,
                passwordHash,
            })

            const user = await doc.save()

            const token = jwt.sign({
                _id: user._id,
                role: user.role,
            },
            process.env.TOKEN_SECRET_KEY,
            {
                expiresIn: '30d',
            }
        )

            res.json({
                user,
                token,
            })
        } catch (err) {
            console.log(err)
            res.status(500).json({
                message: 'Не удалось зарегистрироваться'
            })
        }
    }

    async login(req, res) {
        try {
            const user = await UserModel.findOne({email: req.body.email})
            if (!user) {
                return res.status(400).json({
                    message: "Неверный логин или пароль"
                })
            }

            const isValidPass = await bcrypt.compare(req.body.password, user.passwordHash)
            if (!isValidPass) {
                return res.status(400).json({
                    message: "Неверный логин или пароль"
                })
            }

            const token = jwt.sign({
                _id: user._id,
                role: user.role,
            },
            process.env.TOKEN_SECRET_KEY,
            {
                expiresIn: '30d',
            }
            )

            res.json({
                user,
                token,
            })
        } catch (err) {
            console.log(err)
            res.status(500).json({
                message: 'Не удалось авторизоваться'
            })
        }
    }

    async getUser(req, res) {
        const userId = req.params.id
        const user = await UserModel.findOne({_id: userId})

        res.json({user})
    }

    async update(req, res) {
        const userId = req.params.id
        const user = await UserModel.findOne({_id: userId})
        const userRatingTracks = user.ratingTracks

        if (req.body.trackId) {
            await user.updateOne({
                ratingTracks: [...userRatingTracks, req.body.trackId]
            })

            res.json({
                success: true,
            })
        }
    }

    async authMe(req, res) {
        try {
            const user = await UserModel.findOne({ _id: req.userId })
            if (!user) {
                return res.status(404).json({
                    message: 'Пользователь не найден'
                })
            }

            res.json({
                user,
            })
        } catch (err) {
            console.log(err)
            res.status(500).json({
                message: 'Нет доступа'
            })
        }
    }
}

module.exports = new UserController()