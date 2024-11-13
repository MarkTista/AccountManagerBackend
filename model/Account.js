const mongoose = require('mongoose'); //importa il modulo mongoose
const { Schema } = mongoose;

//In mongoose SChema è una classe che permette di definire la struttura dei documenti in una collezione di mongodb


const accountSchema = new Schema ({ //sto creando un nuovo schema 
        username: String,
        password: String,
        email: String,
});

mongoose.model('accounts',accountSchema);