const app = require('../server');
const dbConnect = require('../db');

var port = (process.env.MEETINGS_PORT || 3005);

console.log("Starting API server at " + port);

dbConnect().then(
    () => {
        app.listen(port);
        console.log("Server ready!");
    },
    err => {
        console.log("Connection error: " + err)
    }
)