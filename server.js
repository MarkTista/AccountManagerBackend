const express = require('express'); //questo comando importa il modulo express, una libreria di node.js usata per crare server web
const app = express(); //crea un'istanza di express
exports.app = app;
const keys = require('./config/keys.js'); // all'interno del file key.js le informazioni verrano memorizzati nella costante keys

//------Setting up DB
//Ci servirà per interagire con mongodb
const mongoose = require('mongoose');
mongoose.connect(keys.mongoURI);
app.use(express.json());

//------Setting Database models
require('./model/Account');
require('./routes/PlayerRoutes.js')(app); 


app.listen(keys.port, ()=> {
    console.log("Listening on "+keys.port );
});
// questo comando avvia il server e lo mette in ascolto sulla porta 13765