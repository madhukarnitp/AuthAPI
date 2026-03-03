const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        fullname : {
            type: String,
            require: true,
        },
        email : {
            type: String,
            require: true,
            unique: true,
            trim: true
        },
        phone : {
            type: String,
            require: true,
        },
        password : {
            type: String,
            require: true,
            unique: true,
        },
        isVerified : {
            type: Boolean,
            default: false,
        },
        refreshToken: {
            type: String,
        },

        emailVerificationToken: String,
        emailVerificationExpires: Date,
    },
    {
        timestamps: true,
    }
);
const User = mongoose.model('User', userSchema);
module.exports = User;