const mongoose = require('mongoose');

const app = require('../server');
const dbConnect = require('../db');
const Meeting = require('./models/meeting')

var port = (process.env.PORT || 3005);

console.log("Starting API server at " + port);

dbConnect().then(
    () => {
        app.listen(port);

        Meeting.collection.insertMany(
            [
                {
                    "members": [
                        5,
                        new mongoose.Types.ObjectId("5df9cfb41c9d44000047b037"),
                        new mongoose.Types.ObjectId("5df9cfb41c9d44000047b034")
                    ],
                    "_id": new mongoose.Types.ObjectId("5e07bba01c9d4400001ced51"),
                    "name": "One Punch Man come alive",
                    "description": "One-Punch Man tells the story of Saitama, a superhero who can defeat any opponent with a single punch but seeks to find a worthy opponent after growing bored by a lack of challenge in his fight against evil.",
                    "address": "Carrer de Mallorca, 18",
                    "province": "tarragona",
                    "postalCode": "43001",
                    "startingDate": new Date("2020-11-03T22:35:00.000Z"),
                    "endingDate": new Date("2020-11-04T04:30:00.000Z"),
                    "capacity": 80,
                    "creatorId": 5,
                    "__v": 0
                },
                {
                    "members": [
                        new mongoose.Types.ObjectId("5df9cfb41c9d44000047b034"),
                        new mongoose.Types.ObjectId("5df9cfb41c9d44000047b037"),
                        new mongoose.Types.ObjectId("5df9cfb41c9d44000047b035")
                    ],
                    "_id": new mongoose.Types.ObjectId("5e07ba481c9d4400001ced4f"),
                    "name": "Fullmetal Alchemist: Brotherhood come alive",
                    "description": "Brothers Edward and Alphonse Elric are raised by their mother Trisha Elric in the remote village of Resembool in the country of Amestris. Their father Hohenheim, a noted and very gifted alchemist, abandoned his family while the boys were still young, and while in Trisha's care they began to show an affinity for alchemy.",
                    "address": "Calle Zabalbide, 27",
                    "province": "vizcaya",
                    "postalCode": "48006",
                    "startingDate": new Date("2020-07-27T15:35:00.000Z"),
                    "endingDate": new Date("2020-07-27T23:00:00.000Z"),
                    "capacity": 25,
                    "creatorId": new mongoose.Types.ObjectId("5df9cfb41c9d44000047b037"),
                    "__v": 0
                },
                {
                    "members": [
                        new mongoose.Types.ObjectId("5df9cfb41c9d44000047b035"),
                        new mongoose.Types.ObjectId("5df9cfb41c9d44000047b034"),
                        new mongoose.Types.ObjectId("5e07bd431c9d4400001ced53")
                    ],
                    "_id": new mongoose.Types.ObjectId("5e07c2601c9d4400001ced59"),
                    "name": "Mirai Nikki come alive",
                    "description": "The plot depicts the Diary Game, a deadly battle royal between 12 different individuals who are given \"Future Diaries\", special diaries that can predict the future, by Deus Ex Machina, the God of Time and Space, with the last survivor becoming his heir.",
                    "address": "Calle Diego Laínez, 8I",
                    "province": "burgos",
                    "postalCode": "09005",
                    "startingDate": new Date("2020-07-16T19:15:00.000Z"),
                    "capacity": 5,
                    "creatorId": new mongoose.Types.ObjectId("5df9cfb41c9d44000047b035"),
                    "__v": 0
                },
                {
                    "members": [
                        new mongoose.Types.ObjectId("5e07bd431c9d4400001ced53"),
                        new mongoose.Types.ObjectId("5df9cfb41c9d44000047b034"),
                        new mongoose.Types.ObjectId("5df9cfb41c9d44000047b037"),
                        new mongoose.Types.ObjectId("5df9cfb41c9d44000047b035")
                    ],
                    "_id": new mongoose.Types.ObjectId("5e07be8b1c9d4400001ced56"),
                    "name": "Naruto come alive",
                    "description": "The series tells the story of Naruto Uzumaki, a young ninja who seeks to gain recognition from his peers and also dreams of becoming the Hokage, the leader of his village.",
                    "address": "Calle de Manuel Lasala, 16",
                    "province": "zaragoza",
                    "postalCode": "50006",
                    "startingDate": new Date("2020-06-26T18:30:00.000Z"),
                    "endingDate": new Date("2020-06-27T02:30:00.000Z"),
                    "capacity": 4,
                    "creatorId": new mongoose.Types.ObjectId("5df9cfb41c9d44000047b037"),
                    "__v": 0
                },
                {
                    "members": [
                        new mongoose.Types.ObjectId("5df9cfb41c9d44000047b034"),
                        new mongoose.Types.ObjectId("5e07bd431c9d4400001ced53")
                    ],
                    "_id": new mongoose.Types.ObjectId("5e07b8e31c9d4400001ced4e"),
                    "name": "Sword Art Online come alive",
                    "description": "The series takes place in the near future and focuses on protagonist Kazuto \"Kirito\" Kirigaya and Asuna Yuuki as they play through various virtual reality MMORPG worlds.",
                    "address": "Calle Francisco Sarmiento, 13",
                    "province": "burgos",
                    "postalCode": "09006",
                    "startingDate": new Date("2020-06-13T19:05:00.000Z"),
                    "endingDate": new Date("2020-06-13T23:00:00.000Z"),
                    "capacity": 40,
                    "creatorId": new mongoose.Types.ObjectId("5e07bd431c9d4400001ced53"),
                    "__v": 0
                },
                {
                    "members": [
                        new mongoose.Types.ObjectId("5df9cfb41c9d44000047b035"),
                        new mongoose.Types.ObjectId("5df9cfb41c9d44000047b034"),
                        new mongoose.Types.ObjectId("5e07bd431c9d4400001ced53")
                    ],
                    "_id": new mongoose.Types.ObjectId("5e07bc821c9d4400001ced52"),
                    "name": "Tokyo Ghoul come alive",
                    "description": "Tokyo Ghoul is set in an alternate reality where ghouls, creatures that look like normal people but can only survive by eating human flesh, live amongst the human population in secrecy, hiding their true nature in order to evade pursuit from the authorities.",
                    "address": "Calle Andrés Bernáldez, 1",
                    "province": "sevilla",
                    "postalCode": "41005",
                    "startingDate": new Date("2020-05-29T16:45:00.000Z"),
                    "endingDate": new Date("2020-05-29T19:45:00.000Z"),
                    "capacity": 10,
                    "creatorId": new mongoose.Types.ObjectId("5df9cfb41c9d44000047b035"),
                    "__v": 0
                },
                {
                    "members": [
                        new mongoose.Types.ObjectId("5df9cfb41c9d44000047b035"),
                        new mongoose.Types.ObjectId("5df9cfb41c9d44000047b034"),
                        new mongoose.Types.ObjectId("5e07bd431c9d4400001ced53"),
                        new mongoose.Types.ObjectId("5df9cfb41c9d44000047b037"),
                        5
                    ],
                    "_id": new mongoose.Types.ObjectId("5e07ad761c9d4400001ced4a"),
                    "name": "Death Note come alive",
                    "description": "The series centers around a high school student who discovers a supernatural notebook that allows him to kill anyone by writing the victim's name while picturing their face.",
                    "address": "Calle María de Molina, 13",
                    "province": "cordoba",
                    "postalCode": "14011",
                    "startingDate": new Date("2020-05-20T17:30:00.000Z"),
                    "endingDate": new Date("2020-05-21T17:30:00.000Z"),
                    "capacity": 20,
                    "creatorId": new mongoose.Types.ObjectId("5df9cfb41c9d44000047b035"),
                    "__v": 0
                },
                {
                    "members": [
                        new mongoose.Types.ObjectId("5df9cfb41c9d44000047b035"),
                        new mongoose.Types.ObjectId("5df9cfb41c9d44000047b037"),
                        new mongoose.Types.ObjectId("5e07bd431c9d4400001ced53")
                    ],
                    "_id": new mongoose.Types.ObjectId("5e07bd431c9d4400001ced53"),
                    "name": "Steins;Gate come alive",
                    "description": "The story follows a group of students as they discover and develop technology that gives them the means to change the past.",
                    "address": "Calle Urbión, 1",
                    "province": "sevilla",
                    "postalCode": "41005",
                    "startingDate": new Date("2020-05-14T10:30:00.000Z"),
                    "endingDate": new Date("2020-05-14T14:45:00.000Z"),
                    "capacity": 10,
                    "creatorId": new mongoose.Types.ObjectId("5df9cfb41c9d44000047b035"),
                    "__v": 0
                },
                {
                    "members": [
                        new mongoose.Types.ObjectId("5e07bd431c9d4400001ced53"),
                        new mongoose.Types.ObjectId("5df9cfb41c9d44000047b037"),
                        5
                    ],
                    "_id": new mongoose.Types.ObjectId("5e07c6031c9d440000f35b44"),
                    "name": "Noragami come alive",
                    "description": "Hiyori Iki is a normal middle school student until she was involved in a bus accident while trying to protect a stranger. This incident causes her soul to frequently slip out of her body, and she becomes aware of the existence of two parallel worlds: the Near Shore, where regular humans and creatures reside, and the Far Shore, where demons and human souls linger.",
                    "address": "Carrer Vallcalent, 32",
                    "province": "lerida",
                    "postalCode": "25006",
                    "startingDate": new Date("2020-04-13T16:00:00.000Z"),
                    "endingDate": new Date("2020-04-14T02:30:00.000Z"),
                    "creatorId": new mongoose.Types.ObjectId("5e07bd431c9d4400001ced53"),
                    "__v": 0
                },
                {
                    "members": [
                        5,
                        new mongoose.Types.ObjectId("5df9cfb41c9d44000047b034")
                    ],
                    "_id": new mongoose.Types.ObjectId("5e07c3851c9d4400001ced5a"),
                    "name": "Toradora! come alive",
                    "description": "Over the course of the series, Ryuji and Taiga try to set up romantic situations to help each other get to know their friends, but many of the situations backfire. Their classmates observe that they are spending a lot of time with each other, leading to rumors that they might be a couple.",
                    "address": "Paseo Dr. Marañón, 14",
                    "province": "guipuzcoa",
                    "postalCode": "20009",
                    "startingDate": new Date("2020-04-09T16:45:00.000Z"),
                    "capacity": 8,
                    "creatorId": 5,
                    "__v": 0
                },
                {
                    "members": [
                        new mongoose.Types.ObjectId("5df9cfb41c9d44000047b034"),
                        new mongoose.Types.ObjectId("5e07bd431c9d4400001ced53")
                    ],
                    "_id": new mongoose.Types.ObjectId("5e07afe01c9d4400001ced4c"),
                    "name": "Shingeki no Kyojin come alive",
                    "description": "The series is set in a fantasy world where humanity lives within territories surrounded by three enormous walls that protect them from gigantic man-eating humanoids referred to as Titans.",
                    "address": "Av. Askatasuna, 8",
                    "province": "vizcaya",
                    "postalCode": "48003",
                    "startingDate": new Date("2020-03-14T12:15:00.000Z"),
                    "endingDate": new Date("2020-03-14T19:45:00.000Z"),
                    "capacity": 15,
                    "creatorId": new mongoose.Types.ObjectId("5df9cfb41c9d44000047b034"),
                    "__v": 0
                },
                {
                    "members": [
                        new mongoose.Types.ObjectId("5df9cfb41c9d44000047b035"),
                        new mongoose.Types.ObjectId("5df9cfb41c9d44000047b034")
                    ],
                    "_id": new mongoose.Types.ObjectId("5e07c4851c9d4400001ced5b"),
                    "name": "Kimi no Na wa. come alive",
                    "description": "The series tells the story about a high school boy in Tokyo and a high school girl in a rural town who suddenly and inexplicably begin to swap bodies.",
                    "address": "Calle de Jerónima Galés, 47",
                    "province": "valencia",
                    "postalCode": "46017",
                    "startingDate": new Date("2020-02-14T18:00:00.000Z"),
                    "endingDate": new Date("2020-02-14T21:30:00.000Z"),
                    "creatorId": new mongoose.Types.ObjectId("5df9cfb41c9d44000047b035"),
                    "__v": 0
                },
                {
                    "members": [
                        new mongoose.Types.ObjectId("5df9cfb41c9d44000047b035")
                    ],
                    "_id": new mongoose.Types.ObjectId("5e07bffb1c9d4400001ced57"),
                    "name": "Angel Beats! come alive",
                    "description": "The story takes place in the afterlife and focuses on Otonashi, a boy who lost his memories of his life after dying. He is enrolled into the afterlife school and meets a girl named Yuri who invites him to join the Afterlife Battlefront.",
                    "address": "Calle Manuel Ángel Ferrer, 16",
                    "province": "huesca",
                    "postalCode": "22003",
                    "startingDate": new Date("2019-11-10T13:30:00.000Z"),
                    "endingDate": new Date("2019-11-10T15:45:00.000Z"),
                    "capacity": 50,
                    "creatorId": new mongoose.Types.ObjectId("5df9cfb41c9d44000047b035"),
                    "__v": 0
                },
                {
                    "members": [
                        new mongoose.Types.ObjectId("5df9cfb41c9d44000047b034"),
                        new mongoose.Types.ObjectId("5df9cfb41c9d44000047b037"),
                        5
                    ],
                    "_id": new mongoose.Types.ObjectId("5e07c1021c9d4400001ced58"),
                    "name": "Boku no Hero Academia come alive",
                    "description": "The story follows Izuku Midoriya, a boy born without superpowers (called Quirks) in a world where they have become commonplace, but who still dreams of becoming a hero himself.",
                    "address": "Calle del Monasterio de Yuste, 24",
                    "province": "valladolid",
                    "postalCode": "47015",
                    "startingDate": new Date("2019-08-22T21:30:00.000Z"),
                    "endingDate": new Date("2019-08-23T06:30:00.000Z"),
                    "capacity": 100,
                    "creatorId": new mongoose.Types.ObjectId("5df9cfb41c9d44000047b034"),
                    "__v": 0
                },
                {
                    "members": [
                        new mongoose.Types.ObjectId("5e07bd431c9d4400001ced53"),
                        new mongoose.Types.ObjectId("5df9cfb41c9d44000047b034"),
                        new mongoose.Types.ObjectId("5df9cfb41c9d44000047b037"),
                        5
                    ],
                    "_id": new mongoose.Types.ObjectId("5e07bdfb1c9d4400001ced55"),
                    "name": "No Game No Life come alive",
                    "description": "The series follows a group of human gamers seeking to beat the god of games at a series of boardgames in order to usurp the god’s throne.",
                    "address": "Calle Gustavo Gallardo, 1",
                    "province": "sevilla",
                    "postalCode": "41013",
                    "startingDate": new Date("2019-06-01T14:30:00.000Z"),
                    "endingDate": new Date("2019-06-01T21:00:00.000Z"),
                    "capacity": 35,
                    "creatorId": new mongoose.Types.ObjectId("5e07bd431c9d4400001ced53"),
                    "__v": 0
                }
            ]
        );
        console.log("Successfully populated!");
    },
    err => {
        console.log("Connection error: " + err);
    }
)