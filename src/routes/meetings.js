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

    var page = 0;
    var limit = 5;
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
    const meeting = new Meeting({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        description: req.body.description,
        address: req.body.address,
        province: req.body.province,
        postalCode: req.body.postalCode,
        startingDate: req.body.startingDate,
        endingDate: req.body.endingDate,
        capacity: req.body.capacity,
        // En realidad se usa el token del usuario loggeado.
        // Hasta que esté implementado, creamos un ID de prueba.
        creatorId: new mongoose.Types.ObjectId()
    });

    meeting.save().then(result => {
        console.log(result);
        res.status(201).json({
            _id: result._id,
            name: result.name,
            descrption: result.description,
            address: result.address,
            province: result.province,
            postalCode: result.postalCode,
            startingDate: result.startingDate,
            endingDate: result.endingDate,
            capacity: result.capacity,
            creatorId: result.creatorId,
        });
    }).catch(err => {
        console.log(err);
        res.status(400).json({error: err});
    });

    
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

module.exports = router;