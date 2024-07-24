const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ActivitySchema = new Schema({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'accounts', 
    required: true 
},

  movieId: { 
    type: Schema.Types.ObjectId, 
    ref: 'movies', 
  },

  action: { 
    type: String, 
    required: true 
},

  details: { 
    type: String, 
    required: true 
},
  
  createdAt: { 
    type: Date, 
    default: Date.now 
}
}, { collection: 'activity' });

const ActivityModel = mongoose.model('activity', ActivitySchema);

module.exports = ActivityModel;
