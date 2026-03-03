const jwt = require('jsonwebtoken');

const generateAccessToken = (ID) => jwt.sign({id: ID} , process.env.JWT_SECRET, {expiresIn: "15m"});
const refreshAccessToken = (ID) => jwt.sign({id: ID} , process.env.JWT_REFRESH_SECRET, {expiresIn: "7d"});

module.exports = {generateAccessToken, refreshAccessToken };