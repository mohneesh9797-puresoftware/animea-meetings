const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const database = require('../db');

const app = express();
database.connect();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Preventing CORS errors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        return res.status(200).json({});
    }
    
    next();
});

// Routes which should handle requests
const meetingsRoutes = require('../src/routes/meetings');

app.use('/api/v1/meetings', meetingsRoutes);

// Middleware to show logs of every call
app.use(morgan('dev'));

app.use(express.static('public'));

// Handler for 404 - Resource not found
app.use((req, res, next) => {
    res.status(404).send('We think you are lost!');
});

// Handler for error 500
app.use((err, req, res, next) => {
    console.error(err.stack);

    res.sendFile(path.join(__dirname, '../public/500.html'));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.info(`Server has started on port ${PORT}`));
