const express = require('express');
const app =express();
const validator = require('express-validator');
const DBConnect =require('./config/dbconnector');
const authRoutes = require('./Routes/authRoutes');
const path = require('path');
const cookieParser = require("cookie-parser");
require('dotenv').config();

//Database Connection
DBConnect();

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

//app Routes

app.get('/api/health',(req,res)=> res.json({HealthStatus: 'Ok', message: 'Server is Up and Running!'}));
app.use('/api/auth', authRoutes);

// app.listen(process.env.PORT , ()=>{
//     console.log(`Server is Up and running at PORT: ${process.env.PORT}`);
// });
export default app;
