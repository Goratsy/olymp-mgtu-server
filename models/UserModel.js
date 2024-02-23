import { mongoose } from "mongoose";

const UseSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    age: Number,
    email: {type: String, required: true},
});

export default mongoose.model('user', UseSchema);