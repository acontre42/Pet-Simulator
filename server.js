import express from 'express';
const app = express();
const port = 3000;

import {fileURLToPath} from 'url';
import path from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import * as PetController from './controller/PetController.js';

app.use(express.static(__dirname + '/public'));
app.use(express.json());

app.get('/needs', (req, res) => {
    const needs = PetController.getNeedsAsStrings();
    res.status(200).send(needs);
});

app.put('/needs/eat', (req, res) => {
    const value = req.body.value;
    const result = PetController.FILL_FUNCTIONS.eat(value);
    const statusCode = result ? 200 : 400;
    res.status(statusCode).send({result: result});
});

app.put('/needs/socialize', (req, res) => {
    const value = req.body.value;
    const result = PetController.FILL_FUNCTIONS.socialize(value);
    const statusCode = result ? 200 : 400;
    res.status(statusCode).send({result: result});
});

app.put('/needs/play', (req, res) => {
    const value = req.body.value;
    const result = PetController.FILL_FUNCTIONS.play(value);
    const statusCode = result ? 200 : 400;
    res.status(statusCode).send({result: result});
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
});