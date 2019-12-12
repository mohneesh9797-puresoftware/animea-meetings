const mongoose = require('mongoose');

const meetingSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    description: String
});

module.exports = mongoose.model('Meeting', meetingSchema);