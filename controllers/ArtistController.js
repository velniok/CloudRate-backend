const { validationResult } = require("express-validator")
const ArtistModel = require('../models/Artist')
const TrackModel = require('../models/Track')

class ArtistController {
    async create(req, res) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json(errors.array())
            }

            const doc = new ArtistModel({
                name: req.body.name,
                avatarUrl: req.body.avatarUrl,
                soundCloudUrl: req.body.soundCloudUrl,
            })

            const artist = await doc.save()

            res.json({
                artist
            })

        } catch (err) {
            console.log(err)
            res.status(500).json({
                message: 'Не удалось добавить артиста'
            })
        }
    }

    async getAll(req, res) {
        try {
            const artists = await ArtistModel.find()

            res.json(artists)
        } catch (err) {
            console.log(err)
            res.status(500).json({
                message: 'Не удалось получить артистов'
            })
        }
    }

    async getOne(req, res) {
        try {
            const artistId = req.params.id
            const artist = await ArtistModel.findOne({ _id: artistId })

            if (!artist) {
                return res.status(404).json({
                    message: 'Артист не найден'
                })
            }

            const artistTracks = await TrackModel.find({ _id: { $in: artist.tracks } })

            if (!artistTracks) {
                return res.status(404).json({
                    message: 'Треки артиста не найдены'
                })
            }

            artist.tracks = artistTracks
            
            for (const artist of artistTracks) {
                const trackArtistIds = []
                artist.artist.map(e => {
                    trackArtistIds.push(e.artistId)
                })
                
                const trackArtists = await ArtistModel.find({  _id: { $in: trackArtistIds } })
                artist.artist = trackArtists
            }

            res.json(artist)
        } catch (err) {
            console.log(err)
            res.status(500).json({
                message: 'Не удалось получить ариста'
            })
        }
    }

    async update(req, res) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json(errors.array())
            }
            
            const artistId = req.params.id

            await ArtistModel.updateOne(
                {
                    _id: artistId,
                },
                {
                    name: req.body.name,
                    avatarUrl: req.body.avatarUrl,
                    soundCloudUrl: req.body.soundCloudUrl,
                },
            )

            const artist = await ArtistModel.findOne({ _id: artistId })

            if (!artist) {
                return res.status(404).json({
                    message: 'Артист не найден'
                })
            }

            res.json(artist)

        } catch (err) {
            console.log(err)
            res.status(500).json({
                message: 'Не удалось обновить артиста',
            })
        }
    }

    async remove(req, res) {
        try {
            const artistId = req.params.id

            await ArtistModel.findOneAndDelete({ _id: artistId })

            res.json({
                success: true,
            })

        } catch (err) {
            console.log(err)
            res.status(500).json({
                message: 'Не удалось удалить артиста',
            })
        }
    }
}

module.exports = new ArtistController()