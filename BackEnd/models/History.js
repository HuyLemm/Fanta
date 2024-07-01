// models/History.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HistorySchema = new Schema({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
},
  videoId: { 
    type: String, 
    required: true 
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

const HistoryModel = mongoose.model('history', HistorySchema);

module.exports = HistoryModel;
