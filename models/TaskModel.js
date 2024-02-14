const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    description: String,
    year: Number,
    answer: Number,
    difficult: String,
    imageTasks: Array,
});

module.exports = mongoose.model('task', TaskSchema);