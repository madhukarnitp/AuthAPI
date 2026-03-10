const express = require('express');
const app =express();
const DBConnect =require('./config/dbconnector');
const authRoutes = require('./Routes/authRoutes');
const path = require('path');
const cookieParser = require("cookie-parser");
require('dotenv').config();

const PORT = process.env.PORT || 5000;

//Database Connection
DBConnect();

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

//app Routes
app.use('/api/auth', authRoutes);

app.listen(PORT , ()=>{
    console.log(`Server is Up and running at PORT: ${PORT}`);
});