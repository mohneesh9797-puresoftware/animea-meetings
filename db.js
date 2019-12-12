const mongoose = require('mongoose');

function connect() {
    mongoose.connect('mongodb+srv://admin:' + process.env.MONGO_ATLAS_PW + '@animea-meetings-tdrau.mongodb.net/test?retryWrites=true&w=majority', {useNewUrlParser: true});
}

module.exports.connect = connect;