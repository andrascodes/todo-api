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
// GET /todos?completed=true
app.get('/todos', (req, res) => {
    const queryParams = req.query;
    let filteredTodos = todos;

    function parseStringToBoolean(stringValue) {
        if(typeof stringValue !== 'string') {
            return undefined;
        }
        else if(stringValue === 'true') {
            return true;
        }
        else if(stringValue === 'false') {
            return false;
        }
        else {
            return undefined;
        }
    }

    if(queryParams.hasOwnProperty('completed')) {
        const booleanValue = parseStringToBoolean(queryParams.completed);
        if(booleanValue === true) {
            filteredTodos = filteredTodos.filter(item => {
                return item.completed === true;
            });
        }
        else if(booleanValue === false) {
            filteredTodos = filteredTodos.filter(item => {
                return item.completed === false;
            });
        }
        else {
            res.status(400).send();
        }
    }
    
    if(queryParams.hasOwnProperty('q')) {
        const searchString = queryParams.q.trim().toLowerCase();
        if(searchString.length > 0) {
            filteredTodos = filteredTodos.filter(item => {
                return item.description.toLowerCase().indexOf(searchString) >= 0;
            });
        }
        else {
            res.status(400).send();
        }
    }

    res.json(filteredTodos);
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

// PUT /todos/:id
app.put('/todos/:id', (req, res) => {
    let selectedById = todos.find(item => { 
        return item.id === parseInt(req.params.id, 10);
    });
    const body = _.pick(req.body, 'description', 'completed');
    const validAttributes = {};
    
    if(!selectedById) {
        return res.status(404).json({
            error: 'No todo found with that id.'
        });
    }

    // Validate 'completed'
    if(body.hasOwnProperty('completed')) {
        if(_.isBoolean(body.completed)) {
            validAttributes.completed = body.completed;
        }
        else {
            return res.status(400).send();
        }
    }
    // Validate 'description'
    if(body.hasOwnProperty('description')) {
        if(_.isString(body.description) && !body.description.trim().length === 0) {
            validAttributes.description = body.description;
        }
        else {
            return res.status(400).send();
        }
    }

    selectedById = _.extend(selectedById, validAttributes);
    res.json( selectedById );
});

app.listen(PORT, () => {
    console.log(`Express app listening on PORT ${PORT}...`);
});