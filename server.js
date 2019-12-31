const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const morgan = require('morgan');

const database = require('./db');

const BASE_API_PATH = "/api/v1";

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

// Middleware to show logs of every call
app.use(morgan('dev'));

// Route which should handle requests
const meetingsRoutes = require('./src/routes/meetings');
app.use(BASE_API_PATH + '/meetings', meetingsRoutes);

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

module.exports = app;