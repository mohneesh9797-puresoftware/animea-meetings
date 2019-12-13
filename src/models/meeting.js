const mongoose = require('mongoose');

const Provinces = Object.freeze({
    Albacete: 'albacete',
    Alicante: 'alicante',
    Almeria: 'almeria',
    Alava: 'alava',
    Asturias: 'asturias',
    Avila: 'avila',
    Badajoz: 'badajoz',
    IslasBaleares: 'islasbaleares',
    Barcelona: 'barcelona',
    Vizcaya: 'vizcaya', 
    Burgos: 'burgos',
    Caceres: 'caceres', 
    Cadiz: 'cadiz',
    Cantabria: 'cantabria',
    Castellon: 'castellon',
    CiudadReal: 'ciudadreal',
    Cordoba: 'cordoba',
    ACorunya: 'acorunya',
    Cuenca: 'cuenca',
    Guipuzcoa: 'guipuzcoa',
    Girona: 'girona',
    Granada: 'granada',
    Guadalajara: 'guadalajara',
    Huelva: 'huelva',
    Huesca: 'huesca',
    Jaen: 'jaen',
    Leon: 'leon',
    Lerida: 'lerida',
    Lugo: 'lugo',
    Madrid: 'madrid',
    Malaga: 'malaga',
    Murcia: 'murcia',
    Navarra: 'navarra',
    Ourense: 'ourense',
    Palencia: 'palencia',
    LasPalmas: 'laspalmas',
    Pontevedra: 'pontevedra',
    LaRioja: 'larioja',
    Salamanca: 'salamanca',
    SantaCruzDeTenerife: 'santacruzdetenerife',
    Segovia: 'segovia',
    Sevilla: 'sevilla',
    Soria: 'soria',
    Tarragona: 'tarragona',
    Teruel: 'teruel',
    Toledo: 'toledo',
    Valencia: 'valencia',
    Valladolid: 'valladolid',
    Zamora: 'zamora',
    Zaragoza: 'zaragoza',
    Ceuta: 'ceuta',
    Melilla: 'melilla',
});

const meetingSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    province: {
        type: String,
        enum: Object.values(Provinces),
        required: true
    },
    postalCode: {
        type: String,
        required: true
    },
    startingDate: {
        type: Date,
        required: true
    },
    endingDate: Date,
    capacity: Number,
    creatorId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
});

Object.assign(meetingSchema.statics, {
    Provinces,
});

module.exports = mongoose.model('Meeting', meetingSchema);