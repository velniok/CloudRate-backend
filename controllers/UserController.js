const UserModel = require('../models/User')
const TrackModel = require('../models/Track')

class UserController {
    async getUser(req, res) {
        try {
            const userId = req.params.id
            const user = await UserModel.findOne({ _id: userId })

            if (!user) {
                return res.status(404).json({
                    message: 'Пользователь не найден',
                })
            }

            const userRatingTracks = user.ratingTracks
            const newUserRatingTracks = []

            if (userRatingTracks) {
                for (const ratingTrack of userRatingTracks) {
                    const track = await TrackModel.findOne({ _id: ratingTrack.trackId })
                    if (!track) {
                        return res.status(404).json({
                            message: 'Трек пользователя не найден',
                        })
                    }
                    const newTrack = {ratingTrack, track}
                    newUserRatingTracks.push(newTrack)
                }
            }
            user.ratingTracks = newUserRatingTracks

            res.json(user)
        } catch (err) {
            console.log(err)
            res.status(500).json({
                message: 'Не удалось найти пользователя',
            })
        }
    }

    async update(req, res) {
        try {
            const userId = req.params.id
            
            await UserModel.updateOne(
                {
                    _id: userId,
                },
                {
                    name: req.body.name,
                    avatarUrl: req.body.avatarUrl,
                },
            )
            
            const user = await UserModel.findOne({ _id: userId })
            
            if (!user) {
                return res.status(404).json({
                    message: 'Пользователь не найден'
                })
            }
            
            res.json(user)
        } catch (err) {
            res.status(500).json({
                message: 'Не удалось обновить пользователя'
            })
        }
    }
}

module.exports = new UserController()