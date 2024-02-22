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

app.get('/taskByFilter', async (req, res) => {
    let request = req.query;
    let page = Number(request.page);
    let perPage = 2;

    let query = {};

    if (request.difficult) query.difficult = request.difficult;
    if (request.year) query.year = request.year;
    if (request.subject) query.subject = request.subject;

    try {
        let dataTasks = await TaskModel.find(query);
        let response = {tasks: dataTasks.slice((page-1) * perPage, page * perPage), numberOfpage: Math.ceil(dataTasks.length / perPage)};
        res.status(200).json(response);
    } catch (error) { 
        res.status(500).send(`Нельзя применить фильтры: ${err}`);
    }
})

app.get('/checkAnswer', async (req, res) => {
    let request = req.query;
    try {
        let task = await TaskModel.findOne({_id: request.id});
        if (task.answer === Number(request.answer)) {
            res.status(200).json({isCorrectAnswer: true});
        } else {
            res.status(200).json({isCorrectAnswer: false});
        }
    } catch (err) {
        res.status(500).json(`Не найдена задача ${err}`);
    }
});