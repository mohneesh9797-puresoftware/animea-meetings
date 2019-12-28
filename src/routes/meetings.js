const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const axios = require('axios');

const Meeting = require('../models/meeting')
const { Provinces } = require('../models/meeting');
const profileAxios = axios.create({
    baseURL: 'http://localhost:3001/api/'
})

const provincesValues = Object.values(Provinces);

// ----------------- GET /meetings -----------------
// Devuelve todo el listado de meetings. Se puede
// paginar controlando el número de página y el
// número de resultados por página, y filtrar por 
// provincia.

router.get('/', (req, res, next) => {
    console.log(req)
    var page = 0;
    var limit = 5;
    var province = '';

    var query = {};

    // Comprueba que página del listado se debe devolver.
    if (req.query.page && parseInt(req.query.page) > 0) {
        page = parseInt(req.query.page) - 1;
    }

    // Comprueba cuántos resultados por página se deben
    // devolver.
    if (req.query.limit && parseInt(req.query.limit) > 0) {
        limit = parseInt(req.query.limit);
    }

    // Comprueba si existe filtrado por provincia y si
    // es así, qué provincia se debe filtrar.
    if (req.query.province && provincesValues.includes(req.query.province.toLowerCase())) {
        province = req.query.province.toLowerCase();
        query['province'] = province;
    }

    // Obtiene de la base de datos los meetings filtrados
    // y paginados, ordenados por su startingDate.
    Meeting.find(query).select("_id name description address province postalCode startingDate endingDate capacity creatorId members")
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

    Meeting.findById(req.params.meetingId).select("_id name description address province postalCode startingDate endingDate capacity creatorId members")
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

// ----------- GET /meetings/user/:userId ----------
// Devuelve el listado de meetings a los que el
// usuario con la ID indicada se ha unido.

async function getMeetingsFromUser(userId) {

    try {
        // Llamada a la API del microservicio Profile para
        // obtener el listado de IDs de los meetings del
        // usuario.
        let doc = await profileAxios.get('user/' + userId + '/joinedMeetings');
        let meetingsIds = doc.data;

        // Obtiene de la base de datos los meetings cuyo
        // ID se encuentra en el listado obtenido anteriormente.
        let meetingsCollection = await Meeting.find().where('_id').in(meetingsIds)
            .select("_id name description address province postalCode startingDate endingDate capacity creatorId members")
            .exec();
        
        return [false, meetingsCollection];
    
    } catch (error) {

        return [true, error];
    }
}

router.get('/user/:userId', (req, res, next) => {

    var userId = req.params.userId.toString();

    getMeetingsFromUser(userId).then(doc => {
        if (doc[0]) {
            console.log(doc[1]);
            var statusNumber = 500;
            var errorMessage = "Request failed with status code 500.";

            if (doc[1].message.includes('404')) {
                statusNumber = 404;
                errorMessage = "Error 404: We couldn't find any user with the given ID.";
            }

            res.status(statusNumber).json({
                error: errorMessage
            })
        } else {
            console.log(doc[1]);
            res.status(200).json(doc[1]);
        }
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
        meeting.creatorId= new mongoose.Types.ObjectId(),
        meeting.members = req.body.members

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
                creatorId: meeting.creatorId,
                members: meeting.members
            })
        }
    })

    
});

// ---------- DELETE /meetings/:meetingId ----------
// Elimina el meeting correspondiente a la ID que
// se indique.

async function deleteMeeting(meetingId) {

    try {
        var nowDate = new Date(Date.now());

        // TODO: Comprobar que existe un usuario autenticado y
        // obtener su ID.
        let fakeUserId = "1";

        // Obtiene de la base de datos el meeting que se
        // pretende eliminar.
        let doc = await Meeting.findById(meetingId)
            .select("_id name description address province postalCode startingDate endingDate capacity creatorId members")
            .exec();
        
        // Comprobar que existe un meeting con la ID proporcionada.
        if (!doc) {
            throw "Error 404: We couldn't find any meeting with the given ID."

        // Comprobar que la ID del usuario que está intentando
        // abandonar el meeting coincide con su creatorId.
        } else if (doc.creatorId.toString().localeCompare(fakeUserId) != 0) {
            throw "Error 400: You can't delete a meeting that you didn't create.";

        // Comprobar que la startingDate del meeting es futura
        // y, por tanto, dicho meeting no ha comenzado.
        } else if (doc.startingDate <= nowDate) {
            throw "Error 400: You can't delete the meeting. It has already started.";
        
        } else {
            // El listado de miembros del meeting recoge las dependencias
            // con los usuarios que se deben actualizar en la base de datos
            // del microservicio profile.
            var members = doc.members;

            // Eliminamos el meeting de nuestra base de datos.
            await Meeting.deleteOne({_id : meetingId}).exec();
            
            // Actualizamos las dependencias del microservicio profile,
            // quitando el meeting eliminado para cada uno de los miembros
            // en sus respectivos listados de meetings. 
            for (var i = 0; i < members.length; i++) {
                await profileAxios.put('user/' + members[i] + '/leavesMeeting/' + meetingId);
            }

            return [false, members];
        }
    
    } catch (error) {
        return [true, error];
    }
}

router.delete('/:meetingId', (req, res, next) => {

    // Comprobar que se pasa una ID válida como parámetro.
    if(!mongoose.Types.ObjectId.isValid(req.params.meetingId)) {
        res.status(404).json({ error: "Error 404: We couldn't find any meeting with the given ID." });

    } else {
        var meetingId = req.params.meetingId;

        // Llamada al método asíncrono principal que se encarga
        // de eliminar el meeting y actualizar las dependencias
        // en el microservicio Profile
        deleteMeeting(meetingId).then(doc => {

            // Comprobar si se ha producido un error (doc[0] = true) y
            // enviar el código y mensaje adecuados.
            if (doc[0]) {
                console.log(doc[1]);
                var statusNumber = 500;
                var errorMessage = "Request failed with status code 500.";

                if (typeof doc[1] === "string") {
                    errorMessage = doc[1];

                    if (doc[1].includes("400")) {
                        statusNumber = 400;
                    } else if (doc[1].includes("404")) {
                        statusNumber = 404;
                    }
                } else if (doc[1].message.includes("400")) {
                    statusNumber = 400;
                    errorMessage = "Error 400: You can't delete a meeting that you didn't create.";
                }

                res.status(statusNumber).json({
                    error: errorMessage
                })
            } else {
                console.log(doc[1]);
                res.status(200).json(doc[1]);
            }
        });
    }
});

// ------- DELETE /meetings/leave/:meetingId -------
// El usuario que realiza la llamada abandona el
// listado de asistentes del meeting cuya ID se
// indica por parámetros.

async function leaveMeeting(meetingId) {

    try {
        var nowDate = new Date(Date.now());

        // TODO: Comprobar que existe un usuario autenticado y
        // obtener su ID.
        let fakeUserId = "1";

        // Obtiene de la base de datos el meeting que se
        // pretende abandonar.
        let doc = await Meeting.findById(meetingId)
            .select("_id name description address province postalCode startingDate endingDate capacity creatorId members")
            .exec();
        
        // Comprobar que existe un meeting con la ID proporcionada.
        if (!doc) {
            throw "Error 404: We couldn't find any meeting with the given ID."

        // Comprobar que la ID del usuario que está intentando
        // abandonar el meeting no coincide con su creatorId.
        } else if (doc.creatorId.toString().localeCompare(fakeUserId) == 0) {
            throw "Error 400: You can't leave a meeting that you created.";

        // Comprobar que la startingDate del meeting es futura
        // y, por tanto, dicho meeting no ha comenzado.
        } else if (doc.startingDate <= nowDate) {
            throw "Error 400: You can't leave the meeting. It has already started.";

        // Comprobar que la ID del usuario autenticado se
        // encuentra en el listado de members del meeting.
        } else if (!doc.members.includes(fakeUserId)) {
            throw "Error 400: You can't leave a meeting that you are not a member of.";
        
        } else {
            // Eliminar la ID del usuario autenticado del listado
            // de members del meeting.
            var newMembers = doc.members;
            newMembers.splice(newMembers.indexOf(fakeUserId), 1);

            // Actualizar el meeting con su nuevo listado de
            // members en la base de datos.
            let updatedMeeting = await Meeting.findByIdAndUpdate(meetingId, {members: newMembers});
            console.log(updatedMeeting);

            // Llamada al microservicio de Profile para actualizar
            // las dependencias y reflejar el abandono del usuario
            // del meeting.
            await profileAxios.put('user/' + fakeUserId + '/leavesMeeting/' + meetingId);

            return [false, updatedMeeting];
        }
    
    } catch (error) {
        return [true, error];
    }
}

router.delete('/leave/:meetingId', (req, res, next) => {

    // Comprobar que se pasa una ID válida como parámetro.
    if(!mongoose.Types.ObjectId.isValid(req.params.meetingId)) {
        res.status(404).json({ error: "Error 404: We couldn't find any meeting with the given ID." });

    } else {
        var meetingId = req.params.meetingId;

        // Llamada al método asíncrono principal que se encarga
        // de eliminar al usuario del meeting y actualizar los
        // datos en el microservicio Profile
        leaveMeeting(meetingId).then(doc => {

            // Comprobar si se ha producido un error (doc[0] = true) y
            // enviar el código y mensaje adecuados.
            if (doc[0]) {
                console.log(doc[1]);
                var statusNumber = 500;
                var errorMessage = "Request failed with status code 500.";

                if (typeof doc[1] === "string") {
                    errorMessage = doc[1];

                    if (doc[1].includes("400")) {
                        statusNumber = 400;
                    } else if (doc[1].includes("404")) {
                        statusNumber = 404;
                    }
                } else if (doc[1].message.includes("400")) {
                    statusNumber = 400;
                    errorMessage = "Error 400: You can't leave a meeting that you are not a member of.";
                }

                res.status(statusNumber).json({
                    error: errorMessage
                })
            } else {
                console.log(doc[1]);
                res.status(200).json(doc[1]);
            }
        });
    }
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