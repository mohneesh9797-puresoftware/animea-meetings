const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Meeting = require('../models/meeting')

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Handling GET requests to /meetings'
    });
});

router.get('/:meetingId', (req, res, next) => {
    Meeting.findById(req.params.meetingId).exec()
        .then(doc => {
            console.log(doc);
            res.status(200).json(doc);
        }).catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });
});

router.post('/', (req, res, next) => {
    const meeting = new Meeting({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        description: req.body.description
    });

    meeting.save().then(result => {
        console.log(result);
    }).catch(err => console.log(err));

    res.status(201).json({
        message: 'Handling POST requests to /meetings',
        createdMeeting: meeting
    });
});

module.exports = router;