const mongoose = require('mongoose');

const USER = 'admin';
const PASSWORD = 'admin';
const SERVER = 'animea-meetings-tdrau.mongodb.net';
const DATABASE = 'test'
const OPTIONS = 'retryWrites=true&w=majority';

function connect() {
    mongoose.connect(`mongodb+srv://${USER}:${PASSWORD}@${SERVER}/${DATABASE}?${OPTIONS}`, {useNewUrlParser: true, useUnifiedTopology: true});
}

module.exports.connect = connect;