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
            "members": [
                new mongoose.Types.ObjectId("5df9cfb41c9d44000047b034"),
                new mongoose.Types.ObjectId("5df9cfb41c9d44000047b037"),
                new mongoose.Types.ObjectId("5df9cfb41c9d44000047b035")],
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