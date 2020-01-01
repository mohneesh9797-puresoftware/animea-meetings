const axios = require('axios');

const profileAxios = axios.create({
    baseURL: 'http://localhost:3001/api/'
});

const authAxios = axios.create({
    baseURL: 'http://localhost:3002/api'
});

const Meeting = require('../models/meeting');

module.exports = {
    getMeetingsFromUser: async function (userId) {

        try {
            // Llamada a la API del microservicio Profile para
            // obtener el listado de IDs de los meetings del
            // usuario.
            let doc = await profileAxios.get('user/' + userId + '/joinedMeetings');
            console.log(doc);
            let meetingsIds = doc.data;
    
            // Obtiene de la base de datos los meetings cuyo
            // ID se encuentra en el listado obtenido anteriormente.
            let meetingsCollection = await Meeting.find().where('_id').in(meetingsIds)
                .select("_id name description address province postalCode startingDate endingDate capacity creatorId members")
                .exec();
            console.log(meetingsCollection);
            
            return [false, meetingsCollection];
        
        } catch (error) {
    
            return [true, error];
        }
    },

    createMeeting: async function (userToken, meeting) {

        try {
            // Comprobar que existe un usuario autenticado
            if (userToken == null) {
                throw "Error 401: You must be authenticated to create a meeting."; 
            
            // Comprobar que la startingDate del meeting es anterior a la endingDate.
            } else if (meeting.startingDate > meeting.endingDate) {
                throw "Error 400: The starting date can't be after the ending date.";

            } else {

                // Obtener la información del usuario, incluyendo la ID,
                // a partir de su token.
                let userInfo = await authAxios.get('auth/me', {headers: {'x-access-token': userToken}});
                console.log(userInfo);
                
                // Comprobar que existe un usuario con el token recibido.
                if(!userInfo) {
                    throw "Error 401: No user matches the given token.";

                } else {
                    // Obtener la ID del usuario autenticado.
                    var userId = userInfo.data._id;

                    // Asignar la ID del usuario que ha creado la quedada como CreatorID.
                    meeting.creatorId = userId;

                    // Añadir la ID del creador al listado members.
                    meeting.members.push(userId);

                    // Guardar.
                    let createdMeeting = await meeting.save();
                    console.log(createdMeeting);
            
                    // Llamada al microservicio de Profile para actualizar
                    // las dependencias y reflejar la unión del usuario
                    // al meeting.
                    await profileAxios.put('user/' + userId + '/joinsMeeting/' + meeting._id);

                    return [false, createdMeeting];
                }
            }
        
        } catch (error) {
            
            return [true, error];
        }
    },

    deleteMeeting: async function (meetingId) {

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
            console.log(doc);
            
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
    
                return [false, null];
            }
        
        } catch (error) {
            return [true, error];
        }
    },

    leaveMeeting: async function (meetingId) {

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
                let updatedMeeting = await Meeting.findByIdAndUpdate(meetingId, {members: newMembers}, {new: true});
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
    },

    joinMeeting: async function (userToken, meetingId) {

        try {
            var nowDate = new Date(Date.now());
    
            // Obtiene de la base de datos el meeting al que se quiere unir.
            let doc = await Meeting.findById(meetingId)
                .select("_id name description address province postalCode startingDate endingDate capacity creatorId members")
                .exec();
            console.log(doc);
            
            // Comprobar que existe un usuario autenticado
            if (userToken == null) {
                throw "Error 401: You must be authenticated to create a meeting.";
            
            // Comprobar que existe un meeting con la ID proporcionada.
            } else if (!doc) {
                throw "Error 404: We couldn't find any meeting with the given ID.";
    
            // Comprobar la capacidad del Meeting.
            } else if (doc.capacity != null && doc.capacity == doc.members.length) {
                throw "Error 400: Sorry, this meeting is full.";
    
            // Comprobar que la startingDate del meeting es futura
            // y, por tanto, dicho meeting no ha comenzado.
            } else if (doc.startingDate <= nowDate) {
                throw "Error 400: You can't join the meeting. It has already started.";
            
            } else {

                // Obtener la información del usuario, incluyendo la ID,
                // a partir de su token.
                let userInfo = await authAxios.get('auth/me', {headers: {'x-access-token': userToken}});
                console.log(userInfo);

                // Comprobar que existe un usuario con el token recibido.
                if(!userInfo) {
                    throw "Error 401: No user matches the given token.";
                
                // Comprobar que la ID del usuario autenticado se
                // encuentra en el listado de members del meeting.
                } else if (doc.members.includes(userInfo.data._id)) {
                    throw "Error 400: You are already a member!";
                
                } else {
                    // Obtener la ID del usuario autenticado.
                    var userId = userInfo.data._id;

                    // Modificar el atributo members, 
                    // añadiendo el ID del usuario actual.
                    var newMembers = doc.members;
                    newMembers.push(userId);
        
                    // Actualizar el meeting con su nuevo listado de
                    // members en la base de datos.
                    let updatedMeeting = await Meeting.findByIdAndUpdate(meetingId, {members: newMembers}, {new: true});
                    console.log(updatedMeeting);
        
                    // Llamada al microservicio de Profile para actualizar
                    // las dependencias y reflejar la unión del usuario
                    // al meeting.
                    await profileAxios.put('user/' + userId + '/joinsMeeting/' + meetingId);
        
                    return [false, updatedMeeting];
                }
            }
        
        } catch (error) {

            return [true, error];
        }
    },

    updateMeeting: async function (requestBody, meetingId) {

        try {
    
            // TODO: Comprobar que existe un usuario autenticado y
            // obtener su ID.
            let fakeUserId = "1";
            
            // Comprobar que la startingDate del meeting es anterior a la endingDate.
            if (requestBody.startingDate > requestBody.endingDate) {
                throw "Error 400: The starting date can't be after the ending date";

            // Comprobar que la capacidad del meeting no es menor al número de miembros
            // ya registrados en el meeting.
            } else if (requestBody.capacity < requestBody.members) {
                throw "Error 400: Capacity can't be less than the current number of members";

            } else {
                // Obtiene de la base de datos el meeting que se quiere actualizar.
                let doc = await Meeting.findById(meetingId)
                    .select("_id name description address province postalCode startingDate endingDate capacity creatorId members")
                    .exec();
                console.log(doc);

                // Comprobar que existe un meeting con la ID proporcionada.
                if (!doc) {
                    throw "Error 404: We couldn't find any meeting with the given ID."

                // Comprobar que la ID del usuario que está intentando
                // actualizar el meeting coincide con su creatorId.
                } else if (doc.creatorId.toString().localeCompare(fakeUserId) != 0) {
                    throw "Error 400: You can't update a meeting that you didn't create.";

                } else {
                    // Actualizar el meeting con sus nuevos atributos
                    // en la base de datos.
                    let updatedMeeting = await Meeting.findByIdAndUpdate(meetingId, 
                        {name: requestBody.name, description: requestBody.description,
                            address: requestBody.address, province: requestBody.province,
                            postalCode: requestBody.postalCode, startingDate: requestBody.startingDate,
                            endingDate: requestBody.endingDate, capacity: requestBody.capacity}, 
                        {new: true, runValidators: true});
                    console.log(updatedMeeting);

                    return [false, updatedMeeting];
                }
            }
        
        } catch (error) {
            
            return [true, error];
        }
    },
}
