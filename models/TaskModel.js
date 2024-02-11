const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    description: String,
    year: Number,
});

module.exports = mongoose.model('task', TaskSchema);