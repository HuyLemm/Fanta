const AccountModel = require('../models/Account');
const ReviewModel = require('../models/Review');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const tokenStore = require('../utils/tokenStore');

exports.getUserProfile = async (req, res) => {
    try {
        const token = req.cookies.jwt || (req.headers['authorization'] && req.headers['authorization'].split(' ')[1]);
        if (!token) return res.status(401).json({ message: 'No token, authorization denied' });
  
        const decoded = jwt.verify(token, process.env.SESSION_SECRET);
        const userId = decoded._id;
  
        const userProfile = await AccountModel.findById(userId).select('-password');
        if (!userProfile) {
            return res.status(404).json({ message: 'User profile not found' });
        }
        res.json(userProfile);
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ message: 'Server Error' });
    }
  };
  
  
  exports.updateUserProfile = async (req, res) => {
    const { email, username } = req.body;
    try {
        const token = req.cookies.jwt || (req.headers['authorization'] && req.headers['authorization'].split(' ')[1]);
        if (!token) return res.status(401).json({ message: 'No token, authorization denied' });
  
        const decoded = jwt.verify(token, process.env.SESSION_SECRET);
        const userId = decoded._id;
  
        const updates = {};
        if (email) updates.email = email;
        if (username) updates.username = username;
  
        const updatedProfile = await AccountModel.findByIdAndUpdate(
            userId,
            updates,
            { new: true, runValidators: true }
        ).select('-password');
  
  
        if (!updatedProfile) {
            return res.status(404).json({ message: 'User profile not found' });
        }
        res.status(200).json({ message: 'Profile updated successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
  };
  
  exports.updateUserPassword = async (req, res) => {
    const { currentPassword, newPassword, confirmPassword } = req.body;
  
    if (newPassword !== confirmPassword) {
        return res.status(400).json({ error: 'New password and confirm password do not match.' });
    }
  
    try {
        const token = req.cookies.jwt || (req.headers['authorization'] && req.headers['authorization'].split(' ')[1]);
        const decodedToken = jwt.verify(token, process.env.SESSION_SECRET);
        const userId = decodedToken._id;
  
        const user = await AccountModel.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'Admin not found.' });
        }
  
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Current password is incorrect.' });
        }
  
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
  
        res.status(200).json({ message: 'Password updated successfully!' });
    } catch (error) {
        res.status(500).json({ error: 'Server error.' });
    }
  };
  
  exports.addReviews = async (req, res) => {
    try {
        const { movieId } = req.params;
        const { comment } = req.body;
        const newReview = new ReviewModel({ movie: movieId, userId: req.user._id, comment });
        await newReview.save();
    
        const populatedReview = await newReview.populate('userId', 'username').execPopulate();
        res.json(populatedReview);
      } catch (error) {
        console.error('Error adding review:', error); // Log lỗi chi tiết
        res.status(500).send('Server error');
      }
  };