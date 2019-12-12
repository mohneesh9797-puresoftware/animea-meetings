const mongoose = require('mongoose');

const SERVER = 'localhost:27017';
const DATABASE = 'meetings';
const OPTIONS = 'retryWrites=true&w=majority';

function connect() {
    mongoose.connect('mongodb+srv://admin:' + process.env.MONGO_ATLAS_PW + '@animea-meetings-tdrau.mongodb.net/test?retryWrites=true&w=majority', {useNewUrlParser: true});
}

module.exports.connect = connect;