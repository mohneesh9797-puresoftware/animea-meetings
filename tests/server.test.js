const request = require('supertest');

const app = require('../server.js');

describe("Hello world tests", () => {

    it("Should do an stupid test", () => {
        const a = 5;
        const b = 3;
        const sum = a + b;

        expect(sum).toBe(8);
    });

});

describe("Meetings API", () => {
    describe("GET /", () => {
        it("Should return an HTML document", () => {
            return request(app).get("/").then((response) => {
                expect(response.status).toBe(200);
                expect(response.type).toEqual(expect.stringContaining("html"));
                expect(response.text).toEqual(expect.stringContaining("Welcome to express!"));
            });
        });
    });
});