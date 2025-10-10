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

            for (const review of track.reviews) {
                const reviewUser = await UserModel.findOne({ _id: review.userId })

                if (!reviewUser) {
                    return res.status(404).json({
                        message: 'Не удалось найти пользователя',
                    })
                }

                const newReviewUser = {
                    nickname: reviewUser.nickname,
                    avatarUrl: reviewUser.avatarUrl
                }

                review.reviewUser = newReviewUser
            }

            res.json(track)
        } catch (err) {
            console.log(err)
        }
    }

    async getTopRating(req, res) {
        try {
            const tracks = await TrackModel.find()
                .sort({ "ratingTrack.0.overall.rating.rating": -1 })
                .limit(13)
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

    async getLatestComment(req, res) {
         try {
            const reviews = await TrackModel.aggregate([
                { $unwind: "$reviews" },
                {
                    $replaceRoot: {
                    newRoot: {
                        $mergeObjects: [
                        "$reviews",
                        {
                            track: {
                                trackId: "$_id",
                                name: "$name",
                                avatarUrl: "$avatarUrl",
                                artist: "$artist",
                            }
                        }
                        ]
                    }
                    }
                },
                { $sort: { createdAt: -1 } },
                { $limit: 3 }
            ])

            if (!reviews) {
                return res.status(404).json({
                    message: 'Не удалось найти обзор',
                })
            }

            for (const review of reviews) {
                const user = await UserModel.findOne({ _id: review.userId })

                if (!user) {
                    return res.status(404).json({
                        message: 'Не удалось найти пользователя',
                    })
                }

                review.user = {
                    id: user._id,
                    nickname: user.nickname,
                    avatarUrl: user.avatarUrl,
                }
            }

            res.json(reviews)
        } catch (err) {
            console.log(err)
            res.status(500).json({
                message: 'Не удалось получить обзоры',
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

                    const newRatingOverall = {
                        userId: req.body.userId,
                        rating: req.body.ratingOverall
                    }

                    ratingTrackData[0].overall.rating.push(newRatingOverall)

                    let newAvgRatingOverall = 0
                    ratingTrackData[0].overall.rating.map(e => {
                        newAvgRatingOverall += e.rating
                    })
                    ratingTrackData[0].overall.avgRating = Math.round(newAvgRatingOverall / ratingTrackData[0].overall.rating.length)

                    ratingCriteria.map((e, index) => {
                        const criteria = ratingTrackData[0].criteria.filter(obj => obj.id === index + 1)[0]
                        const newRatingCriteria = {
                            userId: req.body.userId,
                            rating: e
                        }
                        criteria.rating.push(newRatingCriteria)

                        let newAvgRatingCriteria = 0
                        criteria.rating.map(e => {
                            newAvgRatingCriteria += e.rating
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

                    if (req.body.review && req.body.review !== '') {
                        const review = req.body.review
                        const trackReviews = track.reviews

                        const newReviewObj = {
                            userId: req.body.userId,
                            review: review,
                            rating: {
                                ratingOverall,
                                ratingCriteria,
                            },
                            createdAt: new Date()
                        }

                        newUserRatingTrack.review = req.body.review

                        await track.updateOne({
                            reviews: [...trackReviews, newReviewObj]
                        })
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

            const trackRating = track.ratingTrack[0].overall.rating

            for (const rating of trackRating) {
                const user = await UserModel.findOne({ _id: rating.userId })
                    if (!user) {
                        return res.status(404).json({
                            message: 'Не удалось найти пользователя',
                        })
                    }
                const filteredUserTracks = user.ratingTracks.filter(e => e.trackId.toString() !== trackId)
                await UserModel.updateOne(
                    {
                        _id: rating.userId
                    },
                    {
                        ratingTracks: filteredUserTracks
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