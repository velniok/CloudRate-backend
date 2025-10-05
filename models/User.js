const mongoose = require("mongoose");

    const UserSchema = new mongoose.Schema({
        role: {
            type: String,
            default: 'user'
        },
        nickname: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        passwordHash: {
            type: String,
            required: true,
        },
        avatarUrl: {
            type: String,
            default: null,
        },
        ratingTracks: {
            type: Array,
            default: [],
        }
        }, {
            timestamps: true,
        })

    module.exports = mongoose.model('User', UserSchema)