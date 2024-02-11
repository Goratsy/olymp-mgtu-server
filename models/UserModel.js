const mongoose = require('mongoose');

const UseSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    age: Number,
    email: {type: String, required: true},
});

module.exports = mongoose.model('user', UseSchema);