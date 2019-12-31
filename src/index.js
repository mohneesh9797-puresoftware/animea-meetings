const app = require('../server');

var port = (process.env.PORT || 3000);

app.listen(port, () => console.info(`Server has started on port ${port}`));