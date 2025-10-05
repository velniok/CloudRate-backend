const TrackModel = require('../models/Track')
const ArtistModel = require('../models/Artist')
const UserModel = require('../models/User')

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

            if (!tracks) {
                return res.status(404).json({
                    message: 'Не удалось найти треки',
                })
            }

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

            if (!track) {
                return res.status(404).json({
                    message: 'Трек не найден'
                })
            }

            const trackArtists = []

            for (const artist of track.artist) {
                const trackArtist = await ArtistModel.findOne({ _id: artist.artistId })

                if (!trackArtist) {
                    return res.status(404).json({
                        message: 'Не удалось найти артиста',
                    })
                }

                trackArtists.push(trackArtist)
            }
            
            track.artist = trackArtists
            res.json(track)
        } catch (err) {
            console.log(err)
        }
    }

    async getArtists(req, res) {
        try {
            const trackId = req.params.id
            const track = await TrackModel.findOne({ _idid: trackId })

            if (!track) {
                return res.status(404).json({
                    message: 'Не удалось найти трек',
                })
            }

            const trackArtists = track.artist
            const artists = []

            trackArtists.map(async (e) => {
                const artist = await ArtistModel.findOne({ _id: e.artistId })

                if (!artist) {
                    return res.status(404).json({
                        message: 'Не удалось найти артиста',
                    })
                }

                artists.push(artist)
                if (artists.length === trackArtists.length) {
                    res.json(artists)
                }
            })
        } catch (err) {
            console.log(err)
            res.status(404).json({
                message: 'Не удалось получить трек',
            })
        }
    }

    async getTopRating(req, res) {
        try {
            const tracks = await TrackModel.find()
                .sort({ "ratingTrack.0.overall.rating": -1 })
                .limit(5)
                .exec()

            if (!tracks) {
                return res.status(404).json({
                    message: 'Не удалось найти треки',
                })
            }

            for (const track of tracks) {
                const newArtist = []
                for (const artist of track.artist) {
                    const trackArtist = await ArtistModel.findOne({ _id: artist.artistId })

                    if (!trackArtist) {
                        return res.status(404).json({
                            message: 'Не удалось артиста трека',
                        })
                    }

                    newArtist.push(trackArtist)
                }
                track.artist = newArtist
            }

            res.json(tracks)
        } catch (err) {
            console.log(err)
            res.status(500).json({
                message: 'Не удалось получить треки',
            })
        }
    }

    async update(req, res) {
        try {
            const trackId = req.params.id
            const track = await TrackModel.findOne({ _id: trackId })

            if (!track) {
                return res.status(404).json({
                    message: 'Не удалось найти треки',
                })
            }

                if (req.body.ratingOverall && req.body.ratingCriteria) {
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

                    const user = await UserModel.findOne({ _id: req.body.userId })

                    if (!user) {
                        return res.status(404).json({
                            message: 'Пользователь не найден'
                        })
                    }

                    const userRatingTracks = user.ratingTracks
                    const newUserRatingTrack = {
                        trackId: trackId,
                        ratingOverall: req.body.ratingOverall,
                        ratingCriteria: req.body.ratingCriteria,
                    }

                    await user.updateOne({
                        ratingTracks: [...userRatingTracks, newUserRatingTrack]
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

                    res.json(track)
                }
        } catch (err) {
            console.log(err)
            res.status(500).json({
                message: 'Не удалось обновить трек',
            })
        }
    }

    async remove(req, res) {
        try {
            const trackId = req.params.id
            const track = await TrackModel.findOne({ _id: trackId })

            if (!track) {
                return res.status(404).json({
                    message: 'Не удалось найти треки',
                })
            }

            const trackArtists = track.artist
            
            for (const trackArtist of trackArtists) {
                const artist = await ArtistModel.findOne({ _id: trackArtist.artistId })

                if (!artist) {
                    return res.status(404).json({
                        message: 'Не удалось найти артиста',
                    })
                }

                const filteredArtistTracks = artist.tracks.filter(e => e.toString() !== trackId)
                await ArtistModel.updateOne(
                    {
                        _id: trackArtist.artistId
                    },
                    {
                        tracks: filteredArtistTracks
                    }
                )
            }

            await TrackModel.deleteOne({ _id: trackId })

            res.json({
                success: true,
            })

        } catch (err) {
            console.log(err)
            res.status(404).json({
                message: 'Не удалось удалить трек',
            })
        }
    }
}

module.exports = new TrackController()