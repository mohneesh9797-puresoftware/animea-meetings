const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const axios = require('axios');

const Meeting = require('../models/meeting')
const { Provinces } = require('../models/meeting');
const profileAxios = axios.create({
    baseURL: 'http://localhost:3001/api/'
})
const meetingService = require('../services/meetingService');

const provincesValues = Object.values(Provinces);

// ----------------- GET /meetings -----------------
// Devuelve todo el listado de meetings. Se puede
// paginar controlando el número de página y el
// número de resultados por página, y filtrar por 
// provincia.

router.get('/', (req, res, next) => {

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

    // Comprueba si existe algún parámetro de búsqueda
    // para obtener en el name y description.´
    if (req.query.searchQuery && req.query.searchQuery.toString() != "") {
        searchQuery = req.query.searchQuery.toString();

        query['name'] = new RegExp(searchQuery, "i");
        query['description'] = new RegExp(searchQuery, "i");
    }

    // Obtiene de la base de datos los meetings filtrados
    // y paginados, ordenados por su startingDate.
    Meeting.find(query).select("_id name description address province postalCode startingDate endingDate capacity creatorId members")
        .sort({startingDate: 'desc'})
        .skip(page * limit)
        .limit(limit)
        .exec().then(docs => {
            console.log(docs);
            res.status(200).json({
                meetings: docs,
                message: "Status 200: Meetings retrieved successfully."
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: "Error 500: Request failed with status code 500."
            })
        });
});


// ------------ GET /meetings/:meetingId -----------
// Devuelve el meeting correspondiente a la ID que
// se indique.

router.get('/:meetingId', (req, res, next) => {

    // Comprobar que se pasa una ID válida como parámetro.
    if(!mongoose.Types.ObjectId.isValid(req.params.meetingId)) {
        res.status(404).json({ error: "Error 404: We couldn't find any meeting with the given ID." });
    }

    Meeting.findById(req.params.meetingId).select("_id name description address province postalCode startingDate endingDate capacity creatorId members")
        .exec().then(doc => {
            console.log(doc);
            if (doc) {
                res.status(200).json({
                    meeting: doc,
                    message: "Status 200: Meeting retrieved successfully."
                });
            } else {
                res.status(404).json({
                    error: "Error 404: We couldn't find any meeting with the given ID."
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: "Error 500: Request failed with status code 500."});
        });
});

// ----------- GET /meetings/user/:userId ----------
// Devuelve el listado de meetings a los que el
// usuario con la ID indicada se ha unido.

router.get('/user/:userId', (req, res, next) => {

    var userId = req.params.userId.toString();

    // Llamada al método asíncrono principal que se encarga
    // de hacer una llamada al microservicio Profile para
    // posteriormente obtener los meetings de un usuario.
    meetingService.getMeetingsFromUser(userId).then(doc => {

        // Comprobar si se ha producido un error (doc[0] = true) y
        // enviar el código y mensaje adecuados.
        if (doc[0]) {
            console.log(doc[1]);
            var statusNumber = 500;
            var errorMessage = "Error 500: Request failed with status code 500.";

            if (doc[1].message.includes('404')) {
                statusNumber = 404;
                errorMessage = "Error 404: We couldn't find any user with the given ID.";
            }

            res.status(statusNumber).json({
                error: errorMessage
            })
        } else {
            console.log(doc[1]);
            res.status(200).json({
                meetings: doc[1],
                message: "Status 200: User meetings retrieved successfully."
            });
        }
    });
});

// ----------------- POST /meetings ----------------
// Crea un nuevo meeting y se hace una llamada al
// microservicio de Profile para añadir al listado
// de meetings del usuario que lo crea la ID del
// nuevo meeting.

router.post('/', (req, res, next) => {

    // Creamos un Meeting vacío con su constructor y
    // le asignamos una ID.
    var meeting = new Meeting();
    meeting._id = new mongoose.Types.ObjectId()

    // Asignamos los valores que se han recibido en el body
    // para cada atributo.
    meeting.name = req.body.name
    meeting.description = req.body.description
    meeting.address = req.body.address
    meeting.province = req.body.province
    meeting.postalCode = req.body.postalCode
    meeting.startingDate = req.body.startingDate
    meeting.endingDate = req.body.endingDate
    meeting.capacity = req.body.capacity
    
    // Llamada al método asíncrono principal que se encarga
    // de crear el meeting y actualizar las dependencias
    // en el microservicio Profile
    meetingService.createMeeting(meeting).then(doc => {

        // Comprobar si se ha producido un error (doc[0] = true) y
        // enviar el código y mensaje adecuados.
        if (doc[0]) {
            console.log(doc[1]);
            var statusNumber = 500;
            var errorMessage = "Error 500: Request failed with status code 500.";

            if (typeof doc[1] === "string") {
                errorMessage = doc[1];

                if (doc[1].includes("400")) {
                    statusNumber = 400;
                }
            } else if (doc[1].message.includes("400")) {
                statusNumber = 400;
                errorMessage = "Error 400: The meeting is invalid or user already joined it.";

            } else if (doc[1].message.toLowerCase().includes("validation failed")) {
                statusNumber = 400;
                errorMessage = "Error 400: " + doc[1].message;
            }

            res.status(statusNumber).json({
                error: errorMessage
            })
        } else {
            console.log(doc[1]);
            res.status(201).json({
                meeting: doc[1],
                message: "Status 201: Meeting successfully created!"
            });
        }
    });
});

// --------- POST /meetings/join/:meetingId --------
// El usuario que está autenticado se une al
// meeting referenciado mediante su meetingId.

router.post('/join/:meetingId', (req, res, next) => {

    // Comprobar que se pasa una ID válida como parámetro.
    if(!mongoose.Types.ObjectId.isValid(req.params.meetingId)) {
        res.status(404).json({ error: "Error 404: We couldn't find any meeting with the given ID."});
    }

    // Llamada al método asíncrono principal que se encarga
    // de añadir al usuario al meeting y actualizar las
    // dependencias en el microservicio Profile.
    meetingService.joinMeeting(req.params.meetingId).then(doc => {

        // Comprobar si se ha producido un error (doc[0] = true) y
        // enviar el código y mensaje adecuados.
        if (doc[0]) {
            console.log(doc[1]);
            var statusNumber = 500;
            var errorMessage = "Error 500: Request failed with status code 500.";

            if (typeof doc[1] === "string") {
                errorMessage = doc[1];

                if (doc[1].includes("400")) {
                    statusNumber = 400;
                } else if (doc[1].includes("404")) {
                    statusNumber = 404;
                }
            } else if (doc[1].message.includes("400")) {
                statusNumber = 400;
                errorMessage = "Error 400: The meeting is invalid or user already joined it.";
            }

            res.status(statusNumber).json({
                error: errorMessage
            })
        } else {
            console.log(doc[1]);
            res.status(200).json({
                meeting: doc[1],
                message: "Status 200: Meeting joined successfully!"
            });
        }
    });
});

// ------------ PUT /meetings/:meetingId -----------
// Actualización de los datos básicos del meeting
// cuya ID se indica.

router.put('/:meetingId', (req, res, next) => {

    // Comprobar que se pasa una ID válida como parámetro.
    if(!mongoose.Types.ObjectId.isValid(req.params.meetingId)) {
        res.status(404).json({ error: "Error 404: We couldn't find any meeting with the given ID."});
    }

    var requestBody = req.body;

    // Llamada al método asíncrono principal que se encarga
    // de actualizar el meeting.
    meetingService.updateMeeting(requestBody, req.params.meetingId).then(doc => {

        // Comprobar si se ha producido un error (doc[0] = true) y
        // enviar el código y mensaje adecuados.
        if (doc[0]) {
            console.log(doc[1]);
            var statusNumber = 500;
            var errorMessage = "Error 500: Request failed with status code 500.";

            if (typeof doc[1] === "string") {
                errorMessage = doc[1];

                if (doc[1].includes("400")) {
                    statusNumber = 400;
                } else if (doc[1].includes("404")) {
                    statusNumber = 404;
                }

            } else if (doc[1].message.toLowerCase().includes("validation failed")) {
                statusNumber = 400;
                errorMessage = "Error 400: " + doc[1].message;
            }

            res.status(statusNumber).json({
                error: errorMessage
            })
        } else {
            console.log(doc[1]);
            res.status(200).json({
                meeting: doc[1],
                message: "Status 200: Meeting successfully updated!"
            });
        }
    });
});

// ---------- DELETE /meetings/:meetingId ----------
// Elimina el meeting correspondiente a la ID que
// se indique.

router.delete('/:meetingId', (req, res, next) => {

    // Comprobar que se pasa una ID válida como parámetro.
    if(!mongoose.Types.ObjectId.isValid(req.params.meetingId)) {
        res.status(404).json({ error: "Error 404: We couldn't find any meeting with the given ID." });

    } else {
        var meetingId = req.params.meetingId;

        // Llamada al método asíncrono principal que se encarga
        // de eliminar el meeting y actualizar las dependencias
        // en el microservicio Profile
        meetingService.deleteMeeting(meetingId).then(doc => {

            // Comprobar si se ha producido un error (doc[0] = true) y
            // enviar el código y mensaje adecuados.
            if (doc[0]) {
                console.log(doc[1]);
                var statusNumber = 500;
                var errorMessage = "Error 500: Request failed with status code 500.";

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
                res.status(204).json({
                    message: "Status 204: Meeting successfully deleted!"
                });
            }
        });
    }
});

// ------- DELETE /meetings/leave/:meetingId -------
// El usuario que realiza la llamada abandona el
// listado de asistentes del meeting cuya ID se
// indica por parámetros.

router.delete('/leave/:meetingId', (req, res, next) => {

    // Comprobar que se pasa una ID válida como parámetro.
    if(!mongoose.Types.ObjectId.isValid(req.params.meetingId)) {
        res.status(404).json({ error: "Error 404: We couldn't find any meeting with the given ID." });

    } else {
        var meetingId = req.params.meetingId;

        // Llamada al método asíncrono principal que se encarga
        // de eliminar al usuario del meeting y actualizar los
        // datos en el microservicio Profile
        meetingService.leaveMeeting(meetingId).then(doc => {

            // Comprobar si se ha producido un error (doc[0] = true) y
            // enviar el código y mensaje adecuados.
            if (doc[0]) {
                console.log(doc[1]);
                var statusNumber = 500;
                var errorMessage = "Error 500: Request failed with status code 500.";

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
                res.status(200).json({
                    meeting: doc[1],
                    message: "Status 200: You successfully leaved the meeting."
                });
            }
        });
    }
});

module.exports = router;