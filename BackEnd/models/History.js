const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HistorySchema = new Schema({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'accounts', 
    required: true 
  },
  movieId: { 
    type: Schema.Types.ObjectId, 
    ref: 'movies', 
    required: true 
  },
  latestEpisode: {
    type: Number,
    required: function() { return this.type === 'series'; },
    default: 1
  },
  currentTime: { 
    type: Number, 
    required: true 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
}, { 
    collection: 'history' 
});

const HistoryModel = mongoose.model('History', HistorySchema);

module.exports = HistoryModel;
