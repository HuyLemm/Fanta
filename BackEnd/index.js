require('dotenv').config(); // Load các biến môi trường từ tệp .env

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/database');
const authRoutes = require('./routes/auth');

const app = express();

app.use(cors()); // Cho phép tất cả các nguồn

// Connect to database
connectDB();

// Middleware for parsing request bodies
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Use auth routes
app.use('/api', authRoutes);

// Home route
app.get('/', (req, res) => {
  res.json('Home');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
