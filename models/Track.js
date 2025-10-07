const mongoose = require("mongoose");

const TrackSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    artist: {
        type: Array,
        required: true,
    },
    ratingTrack: {
        type: Array,
        default: [{
            "overall": {
                "name": "Общая оценка",
                "rating": [],
                "avgRating": 0
            },
            "criteria": [
                {
                    "id": 1,
                    "name": "Критерий1",
                    "rating": [],
                    "avgRating": 0
                },
                {
                    "id": 2,
                    "name": "Критерий2",
                    "rating": [],
                    "avgRating": 0
                },
                {
                    "id": 3,
                    "name": "Критерий3",
                    "rating": [],
                    "avgRating": 0
                },
                {
                    "id": 4,
                    "name": "Критерий4",
                    "rating": [],
                    "avgRating": 0
                },
                {
                    "id": 5,
                    "name": "Критерий5",
                    "rating": [],
                    "avgRating": 0
                }
            ]
        }],
    },
    reviews: {
        type: Array,
        default: [],
    },
    avatarUrl: String,
    }, {
        timestamps: true,
    })

 module.exports = mongoose.model('Track', TrackSchema)