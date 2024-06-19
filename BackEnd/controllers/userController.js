const AccountModel = require('../models/Account');
const ReviewModel = require('../models/Review');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
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
    const { email, username, avatar } = req.body;
    try {
        const token = req.cookies.jwt || (req.headers['authorization'] && req.headers['authorization'].split(' ')[1]);
        if (!token) return res.status(401).json({ message: 'No token, authorization denied' });
  
        const decoded = jwt.verify(token, process.env.SESSION_SECRET);
        const userId = decoded._id;
  
        const updates = {};
        if (email) updates.email = email;
        if (username) updates.username = username;
        if (avatar) updates.avatar = avatar;
  
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
      const token = req.cookies.jwt || (req.headers['authorization'] && req.headers['authorization'].split(' ')[1]);
      const decodedToken = jwt.verify(token, process.env.SESSION_SECRET);
      const userId = decodedToken._id;
  
      const { movieId } = req.params;
      const { comment } = req.body;
      const newReview = new ReviewModel({ movie: movieId, userId, comment });
      await newReview.save();
  
      const populatedReview = await newReview.populate('userId', 'username avatar');
      res.json(populatedReview);
    } catch (error) {
      console.error('Error adding review:', error); // Log lỗi chi tiết
      res.status(500).send('Server error');
    }
  };
  

  // Xóa bình luận
  exports.deleteReview = async (req, res) => {
    try {
      const token = req.cookies.jwt || (req.headers['authorization'] && req.headers['authorization'].split(' ')[1]);
      const decodedToken = jwt.verify(token, process.env.SESSION_SECRET);
      const userId = decodedToken._id;
      const { reviewId } = req.params;
      const review = await ReviewModel.findById(reviewId);
  
      if (!review) {
        return res.status(404).send('Review not found');
      }
  
      // Kiểm tra xem người dùng có phải là chủ sở hữu bình luận không
      if (review.userId.toString() !== userId.toString()) {
        return res.status(403).send('Forbidden');
      }
  
      await ReviewModel.deleteOne({ _id: reviewId });
      res.status(200).json({ message: 'Review deleted' });
    } catch (error) {
      console.error('Error deleting review:', error);
      res.status(500).send('Server error');
    }
  };
  
  
  
  
  // Chỉnh sửa bình luận
  exports.updateReview = async (req, res) => {
    try {
      const token = req.cookies.jwt || (req.headers['authorization'] && req.headers['authorization'].split(' ')[1]);
      const decodedToken = jwt.verify(token, process.env.SESSION_SECRET);
      const userId = decodedToken._id;
  
      const { reviewId } = req.params;
      const { comment } = req.body;
      const review = await ReviewModel.findById(reviewId);
  
      if (!review) {
        return res.status(404).send('Review not found');
      }
  
      // Kiểm tra xem người dùng có phải là chủ sở hữu bình luận không
      if (review.userId.toString() !== userId.toString()) {
        return res.status(403).send('Forbidden');
      }
  
      
      review.comment = comment;
      await review.save();
  
      const populatedReview = await review.populate('userId', 'username');
      res.status(200).json(populatedReview);
    } catch (error) {
      console.error('Error updating review:', error);
      res.status(500).send('Server error');
    }
  };
  

