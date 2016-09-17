'use strict';

const express = require('express');
const middleware = require('./middleware.js');

const app = express();

const PORT = process.env.PORT || 3000;

const todos = [{
    id: 1,
    description: "Meet mom for lunch",
    completed: false
}, {
    id: 2,
    description: 'Go to market',
    completed: false
},{
    id: 3,
    description: 'Do logger without DB',
    completed: true
}];

app.use(middleware.logger);

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

app.listen(PORT, () => {
    console.log(`Express app listening on PORT ${PORT}...`);
});