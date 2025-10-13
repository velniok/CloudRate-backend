const ArtistModel = require('../models/Artist')
const TrackModel = require('../models/Track')
const UserModel = require('../models/User')

class SearchController {
    async search(req, res) {
        try {
            const filter = req.params.filter
            if (req.body.value) {
                const value = req.body.value

                if (filter === 'artist') {
                    const artists = await ArtistModel.find({
                        name: {
                            $regex: value,
                            $options: 'i'
                        }
                    })
                    res.json(artists)
                }

                if (filter === 'track') {
                    const tracks = await TrackModel.find({
                        name: {
                            $regex: value,
                            $options: 'i'
                        }
                    })
                    res.json(tracks)
                }

                if (filter === 'user') {
                    const users = await UserModel.find({
                        name: {
                            $regex: value,
                            $options: 'i'
                        }
                    })
                    res.json(users)
                }
            }
        } catch (err) {
            res.status(500).json({
                message: "Не удалось произвести поиск"
            })
        }
    }
}

module.exports = new SearchController()