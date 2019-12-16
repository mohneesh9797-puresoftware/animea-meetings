const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Meeting = require('../models/meeting')
const { Provinces } = require('../models/meeting');

const provincesValues = Object.values(Provinces);

// ----------------- GET /meetings -----------------
// Devuelve todo el listado de meetings. Se puede
// paginar controlando el número de página y de
// resultados por página, y filtrar por provincia.

router.get('/', (req, res, next) => {
    console.log(req)
    var page = 0;
    var limit = 15;
    var province = '';

    var query = {};

    if (req.query.page && parseInt(req.query.page) > 0) {
        page = parseInt(req.query.page) - 1;
    }

    if (req.query.limit && parseInt(req.query.limit) > 0) {
        limit = parseInt(req.query.limit);
    }

    if (req.query.province && provincesValues.includes(req.query.province.toLowerCase())) {
        province = req.query.province.toLowerCase();
        query['province'] = province;
    }

    Meeting.find(query).select("_id name description address province postalCode startingDate endingDate capacity creatorId")
        .sort({startingDate: 'desc'})
        .skip(page * limit)
        .limit(limit)
        .exec().then(docs => {
            console.log(docs);
            res.status(200).json(docs);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
});


// ------------ GET /meetings/:meetingId -----------
// Devuelve el meeting correspondiente a la ID que
// se indique.

router.get('/:meetingId', (req, res, next) => {
    console.log(req)
    if(!mongoose.Types.ObjectId.isValid(req.params.meetingId)) {
        res.status(404).json({ error: "Not Valid ID" });
    }

    Meeting.findById(req.params.meetingId).select("_id name description address province postalCode startingDate endingDate capacity creatorId")
        .exec().then(doc => {
            console.log(doc);
            if (doc) {
                res.status(200).json(doc);
            } else {
                res.status(404).json({ error: "Error 404 Not Found" });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });
});

// ----------------- POST /meetings ----------------
// Crea un nuevo meeting y se hace una llamada al
// microservicio de Profile para añadir al listado
// de meetings del usuario que lo crea la ID del
// nuevo meeting.

router.post('/', (req, res, next) => {
    var meeting = new Meeting();

        meeting._id = new mongoose.Types.ObjectId(),
        meeting.name=req.body.name,
        meeting.description= req.body.description,
        meeting.address= req.body.address,
        meeting.province= req.body.province,
        meeting.postalCode= req.body.postalCode,
        meeting.startingDate= req.body.startingDate,
        meeting.endingDate= req.body.endingDate,
        meeting.capacity= req.body.capacity,
        // member
        meeting.creatorId= new mongoose.Types.ObjectId()

    meeting.save(function(err){
        if(err){
            res.send(err);
        }
        else{
            res.json({
                _id: meeting._id,
                name: meeting.name,
                description: meeting.description,
                address: meeting.address,
                province: meeting.province,
                postalCode: meeting.postalCode,
                startingDate: meeting.startingDate,
                endingDate: meeting.endingDate,
                capacity: meeting.capacity,
                creatorId: meeting.creatorId
            })
        }
    })

    
});

// ---------- DELETE /meetings/:meetingId ----------
// Elimina el meeting correspondiente a la ID que
// se indique.

router.delete('/:meetingId', (req, res, next) => {

    if(!mongoose.Types.ObjectId.isValid(req.params.meetingId)) {
        res.status(404).json({ error: "Not Valid ID" });
    }
    
    const meetingId = req.params.meetingId;

    Meeting.deleteOne({_id : meetingId}).exec().then(doc => {
        console.log(doc);
        if (doc.deletedCount == 1) {
            res.status(204).json({});
        } else {
            res.status(404).json({ error: "Error 404 Not Found" });
        }
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.post('/user/:id/joinsMeeting/:meetingId', (req, res, next) => {
    // meter dos find y luego no se que y luego save
});

router.put('/:meetingId', (req, res, next) => {
    // if(req.creatorId != DEBERIA PONER el token )
    Meeting.findById(req.params.meetingId, function(error, meeting){
        if(error){
            res.send(error);
        }
        meeting.name = req.body.name;
        meeting.description= req.body.description,
        meeting.address= req.body.address,
        meeting.province= req.body.province,
        meeting.postalCode= req.body.postalCode,
        meeting.startingDate= req.body.startingDate,
        meeting.endingDate= req.body.endingDate,
        meeting.capacity= req.body.capacity,

        meeting.save(function(err){
            if(err){
                res.send(err);
            }
            else{
                res.json(' The meeting was successfully updated!')
            }
        })

    });
 });

module.exports = router;