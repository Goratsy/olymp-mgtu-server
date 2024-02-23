import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
    description: String,
    year: Number,
    answer: Number,
    difficult: String,
    imageTasks: Array,
    executionStage: String,
});

export default mongoose.model('task', TaskSchema);