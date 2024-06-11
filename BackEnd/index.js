require('dotenv').config(); // Load các biến môi trường từ tệp .env

const express = require('express');
const cors = require('cors');
var bodyParser = require('body-parser');
var cookieParser = require("cookie-parser");
const connectDB = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const authMiddleware = require('./middleware/authMiddleware');
const adminController = require('./controllers/adminController');
const app = express();

const corsOptions = {
  origin: 'http://localhost:3000', // URL frontend của bạn
  credentials: true, // Cho phép gửi cookie
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Các phương thức HTTP được phép
  allowedHeaders: ['Content-Type', 'Authorization'] // Các tiêu đề HTTP được phép
};

// Connect to database
connectDB().then(() => {
  console.log('Connected to MongoDB');
  adminController.createAdmin(); // Tạo tài khoản admin khi kết nối thành công
});


app.use(cors(corsOptions));

app.use(cookieParser());
// Middleware for parsing request bodies
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/user', authRoutes);

// Route protected by JWT authentication
app.get('/private', authMiddleware.authenticateToken, (req, res, next) => {
  res.json('Welcome');
});


app.get('/', (req, res) => {
  res.send('Public Page');
});


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
