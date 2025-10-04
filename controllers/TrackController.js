const TrackModel = require('../models/Track')
const ArtistModel = require('../models/Artist')
const { Op, literal } = require('sequelize')

class TrackController {
    async create(req, res) {
        try {
            const doc = new TrackModel({
                name: req.body.name,
                artist: req.body.artist,
                rating: req.body.rating,
                avatarUrl: req.body.avatarUrl,
            })

            const track = await doc.save()

            const artists = req.body.artist

            artists.map(async (e) => {
                const artist = await ArtistModel.findOne({ _id: e.artistId })
                const artistTracks = artist.tracks
                await ArtistModel.updateOne(
                    {
                        _id: e.artistId
                    },
                    {
                        tracks: [...artistTracks, track._id]
                    },
                )
            })

            res.json({
                track
            })

        } catch (err) {
            console.log(err)
            res.status(500).json({
                message: 'Не удалось добавить трек'
        })
        }
    }

    async getAll(req, res) {
        try {
            const tracks = await TrackModel.find()

            res.json(tracks)
        } catch (err) {
            console.log(err)
            res.status(500).json({
                message: 'Не удалось получить треки'
            })
        }
    }

    async getOne(req, res) {
        try {
            const trackId = req.params.id
            const track = await TrackModel.findOne({ _id: trackId })
            const trackArtists = []

            for (const artist of track.artist) {
                const trackArtist = await ArtistModel.findOne({ _id: artist.artistId })
                trackArtists.push(trackArtist)
            }
            
            track.artist = trackArtists
            res.json(track)

            // if (!track) {
            //     return res.status(404).json({
            //         message: 'Трек не найден'
            //     })
            // }
        } catch (err) {
            console.log(err)
        }
    }

    async getArtists(req, res) {
        try {
            const trackId = req.params.id
            const track = await TrackModel.findOne({ _idid: trackId })
            const trackArtists = track.artist
            const artists = []

            trackArtists.map(async (e) => {
                const artist = await ArtistModel.findOne({ _id: e.artistId })
                artists.push(artist)
                if (artists.length === trackArtists.length) {
                    res.json(artists)
                }
            })
        } catch (err) {
            console.log(err)
        }
    }

    async getTopRating(req, res) {
        try {
            const tracks = await TrackModel.find()
                .sort({ "ratingTrack.0.overall.rating": -1 })
                .limit(5)
                .exec()

            for (const track of tracks) {
                const newArtist = []
                for (const artist of track.artist) {
                    const trackArtist = await ArtistModel.findOne({ _id: artist.artistId })
                    newArtist.push(trackArtist)
                }
                track.artist = newArtist
            }

            res.json(tracks)
        } catch (err) {
            console.log(err)
        }
    }

    async update(req, res) {
        try {
            const trackId = req.params.id

                if (req.body.ratingOverall && req.body.ratingCriteria) {
                    const track = await TrackModel.findOne({ _id: trackId })
                    const ratingOverall = req.body.ratingOverall
                    const ratingCriteria = req.body.ratingCriteria
                    const ratingTrackData = JSON.parse(JSON.stringify(track.ratingTrack))

                    ratingTrackData[0].overall.rating.push(ratingOverall)

                    let newAvgRatingOverall = 0
                    ratingTrackData[0].overall.rating.map(e => {
                        newAvgRatingOverall += e
                    })
                    ratingTrackData[0].overall.avgRating = Math.round(newAvgRatingOverall / ratingTrackData[0].overall.rating.length)

                    ratingCriteria.map((e, index) => {
                        const criteria = ratingTrackData[0].criteria.filter(obj => obj.id === index + 1)[0]
                        criteria.rating.push(e)

                        let newAvgRatingCriteria = 0
                        criteria.rating.map(e => {
                            newAvgRatingCriteria += e
                        })
                        criteria.avgRating = Math.round((newAvgRatingCriteria / criteria.rating.length) * 10) / 10
                    })

                    await track.updateOne({
                        ratingTrack: ratingTrackData
                    })

                    res.json({
                        success: true,
                        ratingTrack: track.ratingTrack,
                    })
                }

                if (!req.body.ratingOverall || !req.body.ratingCriteria) {
                    await TrackModel.updateOne(
                        {
                            _id: trackId,
                        },
                        {
                        name: req.body.name,
                        avatarUrl: req.body.avatarUrl,
                        },
                    )

                    const track = await TrackModel.findOne({ _id: trackId })

                    res.json(track)
                }
        } catch (err) {
            console.log(err)
        }
    }

    async remove(req, res) {
        try {
            const trackId = req.params.id

            await TrackModel.findOneAndDelete({ _id: trackId })

            res.json({
                success: true,
            })

        } catch (err) {

        }
    }
}

module.exports = new TrackController()