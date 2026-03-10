const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        fullname : {
            type: String,
            required: true,
        },
        email : {
            type: String,
            required: true,
            lowercase: true,
            unique: true,
            trim: true
        },
        phone : {
            type: String,
            unique: true,
            required: true,
        },
        password : {
            type: String,
            required: true,
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
        resetOtp: String,
        resetOtpExpires: Date
    },
    {
        timestamps: true,
    }
);
const User = mongoose.model('User', userSchema);
module.exports = User;