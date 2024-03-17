import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
    description: String,
    year: Number,
    answer: Number,
    difficult: String,
    imageTasks: Array,
    solution: Array,
    executionStage: String,
    answerCode: String,
    point: Number,
    idTask: String,
});

export default mongoose.model('task', TaskSchema);