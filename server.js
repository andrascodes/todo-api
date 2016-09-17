'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const _ = require('underscore');

const middleware = require('./middleware.js');

const app = express();

const PORT = process.env.PORT || 3000;

const todos = [];
let todoNextId = 1;

app.use(middleware.logger);
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Todo API Root');
});

app.get('/todos', (req, res) => {
    res.json(todos);
});

app.get('/todos/:id', (req, res) => {
    const selectedById = todos.filter(item => { 
        return item.id === parseInt(req.params.id, 10);
    });

    if(selectedById.length <= 0) {
        res.status(404).send();
    }
    else {
        res.json( selectedById );
    }
});

app.post('/todos', (req, res) => {
    const body = req.body;

    if(_.isEmpty(body)) {
        res.status(404).send();
    }
    else {
        body.id = todoNextId;
        todoNextId++;
        todos.push(body);

        res.json(body);
    }
});

app.listen(PORT, () => {
    console.log(`Express app listening on PORT ${PORT}...`);
});