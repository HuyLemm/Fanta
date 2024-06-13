const express = require('express');
const router = express.Router();
const GenreModel = require('../models/Genre');
const MovieModel = require('../models/Movie');

exports.getAllGenres = async (req, res) => {
    try {
      const genres = await GenreModel.find({});
      res.status(200).json(genres);
    } catch (error) {
      console.error('Error fetching genres:', error);
      res.status(500).json({ error: 'An error occurred while fetching genres' });
    }
};

exports.getGenresAndSatisfiedMovie = async (req, res) => {
  try {
    const genres = await MovieModel.aggregate([
      { $unwind: "$genre" },
      { $group: { _id: "$genre", movies: { $push: "$$ROOT" } } },
      { $project: { _id: 0, name: "$_id", movies: "$movies" } }
    ]);

    res.json(genres);
  } catch (error) {
    console.error('Error fetching genres:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getMovies = async (req, res) => {
  try {
    const movies = await MovieModel.find({});
    res.status(200).json(movies);
  } catch (error) {
    console.error('Error fetching movies:', error);
    res.status(500).json({ error: 'An error occurred while fetching movies' });
  }
};
