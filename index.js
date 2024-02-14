const express = require('express');
const app = express();
const PORT = process.env.PORT ?? 7000;

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});

app.use(express.json());

const mongoose = require('mongoose');
const urlMongodb = 'mongodb+srv://goratsy:1234@project-mgtu.gl6exz2.mongodb.net/mgtu?retryWrites=true&w=majority';

mongoose
    .connect(urlMongodb)
    .then(() => {console.log('DB connects');})
    .catch(() => {console.log('Error connecting DB');});

const TaskModel = require('./models/TaskModel.js');
const UserModel = require('./models/UserModel.js');

app.get('/test', async (req, res) => {
    try {
        let tasks = await TaskModel.find({});
        res.json(tasks);
    }
    catch (err) {
        res.status(500).send(`Произошла ошибка ${err}`)
    }
});