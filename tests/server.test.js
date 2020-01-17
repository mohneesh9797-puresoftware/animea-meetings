const request = require('supertest');
const mockingoose = require('mockingoose').default;
const nock = require('nock');

const app = require('../server.js');
const Meeting = require('../src/models/meeting');
const authResponses = require('./authResponses');

describe("Hello world tests", () => {

    it("Should do an stupid test", () => {
        const a = 5;
        const b = 3;
        const sum = a + b;

        expect(sum).toBe(8);
    });

});

describe("Meetings API", () => {

    beforeEach(()=>{
        nock(`https://animea-gateway.herokuapp.com`)
            .get('/auth/api/v1/auth/me')
            .reply(200, JSON.stringify(authResponses.verifyToken));

        meetings = [
            {
                "members": [
                    "5df9cfb41c9d44000047b034",
                    "5df9cfb41c9d44000047b037",
                    "5df9cfb41c9d44000047b035"],
                "_id": "5e07ba481c9d4400001ced4f",
                "name": "Fullmetal Alchemist: Brotherhood come alive",
                "description": "Brothers Edward and Alphonse Elric are raised by their mother Trisha Elric in the remote village of Resembool in the country of Amestris. Their father Hohenheim, a noted and very gifted alchemist, abandoned his family while the boys were still young, and while in Trisha's care they began to show an affinity for alchemy.",
                "address": "Calle Zabalbide, 27",
                "province": "vizcaya",
                "postalCode": "48006",
                "startingDate": "2020-07-27T15:35:00.000Z",
                "endingDate": "2020-07-27T23:00:00.000Z",
                "capacity": 25,
                "creatorId": "5df9cfb41c9d44000047b037",
                "__v": 0
            },
            {
                "members": [
                    "5e145b225591df48f0316f03",
                    "5e145b465591df48f0316f06",
                    "5e145b4f5591df48f0316f07",
                ],
                "_id": "5e07bba01c9d4400001ced51",
                "name": "One Punch Man come alive",
                "description": "One-Punch Man tells the story of Saitama, a superhero who can defeat any opponent with a single punch but seeks to find a worthy opponent after growing bored by a lack of challenge in his fight against evil.",
                "address": "Carrer de Mallorca, 18",
                "province": "tarragona",
                "postalCode": "43001",
                "startingDate": "2020-11-03T22:35:00.000Z",
                "endingDate": "2020-11-04T04:30:00.000Z",
                "capacity": 80,
                "creatorId": "5e145b225591df48f0316f03",
                "__v": 0
            },
        ];
    });

    describe("GET /", () => {
        it("Should return an HTML document", () => {
            return request(app).get("/").then((response) => {
                expect(response.status).toBe(200);
                expect(response.type).toEqual(expect.stringContaining("html"));
                expect(response.text).toEqual(expect.stringContaining("Welcome to express!"));
            });
        });
    });

    describe("GET /meetings", () => {
        it('Should return all meetings', () => {
            mockingoose(Meeting).toReturn(meetings, 'find');

            return request(app).get('/api/v1/meetings').then((response) => {
                expect(response.status).toBe(200);
                expect(response.body.meetings).toBeArrayOfSize(2);
            });
        });
    });

    describe("GET /meetings/:meetingId", () => {
        it("Should return meeting with id 5e07ba481c9d4400001ced4f", () =>{
            mockingoose(Meeting).toReturn(meetings[0], 'findOne');

            return request(app).get("/api/v1/meetings/5e07ba481c9d4400001ced4f").then((response)=>{
                expect(response.status).toBe(200);
                expect(response.body.meeting._id).toBe("5e07ba481c9d4400001ced4f");
                expect(response.body.meeting.name).toBe("Fullmetal Alchemist: Brotherhood come alive");
            });
        });
    });

    describe("GET /meetings/user/:userId", () => {
        it("Should return meetings of the user with id 5e145b3c5591df48f0316f05", () =>{
            mockingoose(Meeting).toReturn(meetings[0], 'findOne');

            return request(app).get("/api/v1/meetings/user/5e145b3c5591df48f0316f05").then((response)=>{
                expect(response.status).toBe(200);
                expect(response.body.meetings).toBeArrayOfSize(2);
            });
        });
    });
});