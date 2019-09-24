const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let User = new Schema({
  profilepic: {
    type: String,
    default: ''
  },
  accountcreatedate: {
    type: Date,
    default: Date.now
  },
  username: {
    type: String
  },
  name: {
    first: {
      type: String
    },
    last: {
      type: String
    }
  },
  email: {
    type: String
  },
  password: {
    type: String
  },
  phone: {
    type: String
  },
  watchlist: {
    type: Array,
    default: []
  },
  wishlist: {
    type: Array,
    default: []
  },
  friendlist: {
    type: Array,
    default: []
  }
});

module.exports = mongoose.model('User', User);
