require('dotenv').config(); // Load các biến môi trường từ tệp .env

const express = require('express');
const cors = require('cors');
var bodyParser = require('body-parser');
var cookieParser = require("cookie-parser");
const connectDB = require('./config/database');

const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const publicRoutes = require('./routes/publicRoutes');
const userRoutes = require('./routes/userRoutes');

const adminController = require('./controllers/adminController');


const app = express();

const corsOptions = {
  origin: 'http://localhost:3000', // URL frontend của bạn
  credentials: true, // Cho phép gửi cookie
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization'] 
};

// Connect to database
connectDB().then(() => {
  console.log('Connected to MongoDB');
  adminController.createAdmin(); // Tạo tài khoản admin khi kết nối thành công
});

// Middleware for parsing request bodies
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/public', publicRoutes);
app.use('/user', userRoutes);
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes)

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});

