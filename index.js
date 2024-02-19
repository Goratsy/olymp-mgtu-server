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

app.get('/allTasks', async (req, res) => {
    try {
        let tasks = await TaskModel.find({});
        res.status(200).json(tasks);
    }
    catch (err) {
        res.status(500).send(`Произошла ошибка ${err}`)
    }
});

app.get('/taskByFilter', async (req, res) => {
    let request = req.query;
    let query = {};

    if (request.difficult) query.difficult = request.difficult
    if (request.year) query.year = request.year
    if (request.subject) query.subject = request.subject

    try {
        let dataTasks = await TaskModel.find(query);
        res.status(200).json(dataTasks);
    } catch (error) { 
        res.status(400).send(`Не смогли отфильтровать ${err}`)
    }
})