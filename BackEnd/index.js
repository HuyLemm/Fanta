require('dotenv').config(); // Load các biến môi trường từ tệp .env

const express = require('express');
const cors = require('cors');
var bodyParser = require('body-parser');
var cookieParser = require("cookie-parser");
const connectDB = require('./config/database');
const authRoutes = require('./routes/auth');
const authenticateToken = require('./middleware/authMiddleware');

const app = express();

app.use(cors()); // Cho phép tất cả các nguồn

// Connect to database
connectDB();

app.use(cookieParser())
// Middleware for parsing request bodies
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Use auth routes
app.use('/user', authRoutes);

// Route protected by JWT authentication
app.get('/private', authenticateToken, (req, res, next) => {
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
