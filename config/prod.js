const { app } = require('../server');

module.exports = {
    port: process.env.PORT,
    mongoURI: process.env.MONGO_URI,
};
//------Setting the routes
//require('./routes/authenticationRoutes.js')(app);
require('./routes/update.js')(app);
