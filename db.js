const mongoose = require('mongoose');
const DB_URL = (process.env.MONGO_URL || 'mongodb+srv://admin:admin@animea-meetings-tdrau.mongodb.net/test?retryWrites=true&w=majority')

const dbConnect = function() {
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error: '));
    return mongoose.connect(DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});
}

module.exports = dbConnect;