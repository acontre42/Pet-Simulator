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

app.get('/pet/name', (req, res) => {
    const name = PetController.getName();
    res.status(200).send({name: name});
});

app.patch('/pet/name', (req, res) => {
    const name = req.body.name;
    const valid = PetController.rename(name);
    const statusCode = (typeof valid !== 'undefined' ? 200 : 400);
    const result = (valid ? true : false);
    res.status(statusCode).send({result: result});
});

app.get('/needs', (req, res) => {
    const needs = PetController.getNeeds();
    res.status(200).send(needs);
});

app.get('/needs/sleep', (req, res) => {
    const result = PetController.FILL_FUNCTIONS.sleep();
    const statusCode = (typeof result !== 'undefined' ? 200 : 400);
    res.status(statusCode).send({result: result});
});

app.get('/needs/wake', (req, res) => {
    const result = PetController.wakeUp();
    const statusCode = (typeof result !== 'undefined' ? 200 : 400);
    res.status(statusCode).send({result: result});
});

app.get('/needs/pee', (req, res) => {
    const result = PetController.FILL_FUNCTIONS.pee();
    const statusCode = (typeof result !== 'undefined' ? 200 : 400);
    res.status(statusCode).send({result: result});
});

app.get('/needs/bathe', (req, res) => {
    const result = PetController.FILL_FUNCTIONS.bathe();
    const statusCode = (typeof result !== 'undefined' ? 200 : 400);
    res.status(statusCode).send({result: result});
});

app.patch('/needs/eat', (req, res) => {
    const value = req.body.value;
    const result = PetController.FILL_FUNCTIONS.eat(value);
    const statusCode = (typeof result !== 'undefined' ? 200 : 400);
    res.status(statusCode).send({result: result});
});

app.patch('/needs/socialize', (req, res) => {
    const value = req.body.value;
    const result = PetController.FILL_FUNCTIONS.socialize(value);
    const statusCode = (typeof result !== 'undefined' ? 200 : 400);
    res.status(statusCode).send({result: result});
});

app.patch('/needs/play', (req, res) => {
    const value = req.body.value;
    const result = PetController.FILL_FUNCTIONS.play(value);
    const statusCode = (typeof result !== 'undefined' ? 200 : 400);
    res.status(statusCode).send({result: result});
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
});