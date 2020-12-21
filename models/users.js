const mongoose = require('mongoose');

//Creating a schema for mongodb collection
const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now
    }
})

//mongoose model takes two args , modelname and model schema
const User = mongoose.model('users', UserSchema);

module.exports = User