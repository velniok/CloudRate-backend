const mongoose = require("mongoose");

    const ArtistSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true,
        },
        tracks: {
            type: Array,
            default: [],
        },
        avatarUrl: String,
        soundCloudUrl: {
            type: String,
            required: true,
        }
        }, {
            timestamps: true,
        })

    module.exports = mongoose.model('Artist', ArtistSchema)