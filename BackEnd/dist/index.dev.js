"use strict";

require('dotenv').config(); // Load các biến môi trường từ tệp .env


var express = require('express');

var cors = require('cors');

var bodyParser = require('body-parser');

var cookieParser = require("cookie-parser");

var connectDB = require('./config/database');

var authRoutes = require('./routes/authRoutes');

var adminRoutes = require('./routes/adminRoutes');

var publicRoutes = require('./routes/publicRoutes');

var userRoutes = require('./routes/userRoutes');

var adminController = require('./controllers/adminController');

var userController = require('./controllers/userController');

var app = express(); // Khởi tạo cấu hình CORS cho server

var corsOptions = {
  origin: 'https://fanta.vercel.app/',
  // URL frontend của bạn
  credentials: true,
  // Cho phép gửi cookie
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 204
}; // Connect to database

connectDB().then(function () {
  console.log('Connected to MongoDB');
  adminController.createAdmin(); // Tạo tài khoản admin khi kết nối thành công

  userController.createUsers(); // Tạo người dùng khi kết nối này
}); // Middleware for parsing request bodies

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
app.use('/public', publicRoutes);
app.use('/user', userRoutes);
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes); // Start the server

var PORT = process.env.PORT || 5000;
app.listen(PORT, function () {
  console.log("Server started at http://localhost:".concat(PORT));
});