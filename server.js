'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const _ = require('underscore');

const middleware = require('./middleware.js');

const app = express();

const PORT = process.env.PORT || 3000;

let todos = [];
let todoNextId = 1;

app.use(middleware.logger);
app.use(bodyParser.json());

// GET /
app.get('/', (req, res) => {
    res.send('Todo API Root');
});

// GET /todos
app.get('/todos', (req, res) => {
    res.json(todos);
});

// GET /todos/:id
app.get('/todos/:id', (req, res) => {
    const selectedById = todos.find(item => { 
        return item.id === parseInt(req.params.id, 10);
    });

    if(!selectedById) {
        res.status(404).send();
    }
    else {
        res.json( selectedById );
    }
});

// POST /todos
app.post('/todos', (req, res) => {
    const body = _.pick(req.body, 'description', 'completed');

    // Validate request body
    //  'body.description.trim().length === 0': 
    //      if string is nothing but spaces OR
    //      if string is simply an empty string
    if(_.isEmpty(body)) {
        const error = {
            error: 'Request body was empty.'
        }
        return res.status(400).json(error);
    }
    else if(!_.isBoolean(body.completed)) {
        const error = {
            error: `The request body doesn't have a 'completed' property or it's not a boolean.`
        }
        return res.status(400).json(error);
    }
    else if(!_.isString(body.description)) {
        const error = {
            error: `The request body doesn't have a 'description' property or it's not a string.`
        }
        return res.status(400).json(error);
    }
    else if(body.description.trim().length === 0) {
        const error = {
            error: `The request body's 'description' property is empty.`
        }
        return res.status(400).json(error);
    }
    // if there is no error: SAVE/PERSIST the todo
    // remove trailing spaces from the description
    body.description = body.description.trim();
    body.id = todoNextId;
    todoNextId++;
    todos.push(body);
    res.json(body);
});

// DELETE /todos/:id
app.delete('/todos/:id', (req, res) => {
    const selectedById = todos.find(item => { 
        return item.id === parseInt(req.params.id, 10);
    });

    if(!selectedById) {
        res.status(404).json({
            error: 'No todo found with that id.'
        });
    }
    else {
        todos = _.without(todos, selectedById);
        res.json( selectedById );
    }
});

app.listen(PORT, () => {
    console.log(`Express app listening on PORT ${PORT}...`);
});