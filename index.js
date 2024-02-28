import * as dotenv from 'dotenv';
dotenv.config()
import Express from 'express';
const app = Express();
const PORT = process.env.PORT || 7000;


app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});

app.use(Express.json());

import mongoose from 'mongoose';
const urlMongodb = process.env.API_KEY_MONGODB;

mongoose
    .connect(urlMongodb)
    .then(() => {console.log('DB connects');})
    .catch(() => {console.log('Error connecting DB');});

import TaskModel from './models/TaskModel.js';

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

import multer from 'multer';
import fs from 'fs';
const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('file'), async (req, res) => {
    const file = req.file;
    const idTask = req.query.id;

    let task = await TaskModel.findOne({_id: idTask});
    let answerAuthorsTask = task.helperText;

    if (!file) {
        return res.status(400).send('Нет загруженного файла');
    }

    fs.readFile(`${file.path}`, 'utf8', (err, data) => {
        if (err) {console.error('Ошибка чтения файла:', err); return;}

        const requestJson = {
            message: `
            Ты эксперт, который объясняет ученику, правильность его кода на языке программирования. 
            Примечание: коды могут отличаться друг от друга, главное проверить конечный результат, правильный ли он. 
 
            Это правильный ответ от автора: 
            ${answerAuthorsTask}
             
            Это от ученика: 
            ${data}
             
            Объясни, в чем он не прав, выделяя каждый пункт, обращаясь к ученику на Вы`,
            api_key: process.env.API_KEY_GPT
        };

        fetch('https://ask.chadgpt.ru/api/public/gpt-3.5', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestJson)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Ошибка! Код http-ответа: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.is_success) {
                res.status(200).json({answerFromGPT: data.response});
            } else {
                const error = data.error_message;
                console.error(`Ошибка: ${error}`);
            }
        })
        .catch(error => {
            console.error('Ошибка:', error);
        });
        
        fs.unlink(`${file.path}`, err => {
            if (err) {console.error('Ошибка удаления файла:', err); return;}
        });
    });
});




