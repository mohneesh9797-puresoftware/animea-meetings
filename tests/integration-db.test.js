const mongoose = require('mongoose');

const Meeting = require('../src/models/meeting');
const dbConnect = require('../db');

describe("Meetings DB connection", () => {
    beforeAll(() => {
        return dbConnect();
    });

    beforeEach((done) => {
        Meeting.deleteMany({}, (err) => {
            done();
        });
    });

    it("Writes a meeting in the DB", (done) => {
        const meeting = new Meeting({
            "members": [5, 4, 2],
            "_id": "5e07bba01c9d4400001ced51",
            "name": "One Punch Man come alive",
            "description": "One-Punch Man tells the story of Saitama, a superhero who can defeat any opponent with a single punch but seeks to find a worthy opponent after growing bored by a lack of challenge in his fight against evil.",
            "address": "Carrer de Mallorca, 18",
            "province": "tarragona",
            "postalCode": "43001",
            "startingDate": "2020-11-03T22:35:00.000Z",
            "endingDate": "2020-11-04T04:30:00.000Z",
            "capacity": 80,
            "creatorId": 5,
            "__v": 0
        });

        meeting.save((err, meeting) => {
            expect(err).toBeNull();
            Meeting.find({}, (err, contacts) => {
                expect(contacts).toBeArrayOfSize(1);
                done();
            });
        });
    });

    afterAll((done) => {
        mongoose.connection.db.dropDatabase(() => {
            mongoose.connection.close(done);
        });
    });
});