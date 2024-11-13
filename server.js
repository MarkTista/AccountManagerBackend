const express = require('express'); //questo comando importa il modulo express, una libreria di node.js usata per crare server web
const app = express(); //crea un'istanza di express
const keys = require('./config/keys.js'); // sll'interno del file key.js le informazioni verrano memorizzati nella costante keys

//------Setting up DB
//Ci servirà per interagire con mongodb
const mongoose = require('mongoose');
mongoose.connect(keys.mongoURI);

//------Setting Database models
require('./model/Account');
const Account = mongoose.model('accounts'); // questo mi servira a capire se posso aggiungere nuovi utente, se stanno nomi gia esistenti


//-------Routes(lato sito)
//req->request->richieste http dal client al server(in questo caso è una richiesta GET all'endpoint /account)
//res->response->risposta dal server al client
//get->METODO GET HTTP
app.get('/account', async (req,res)=>{

    const {rUsername, rPassword } = req.query;
    if(rUsername == null || rPassword == null)
    {
        res.send("Credenziali non valide");
        return; 
    }

    var useraccount = await Account.findOne({ username : rUsername}) // questo controllo mi serve per vedere se esistono gia altri usernmane con lo stesso nome
    if(useraccount == null)
    {
        console.log("Crea un nuovo account");
        var newAccount = new Account({
            username : rUsername,
            password : rPassword,
        });
    console.log(newAccount);
    await newAccount.save();
    res.send(newAccount);
    return;

    }else{
        if(rPassword == useraccount.password) // vede se 
        {
           await useraccount.save();
           res.send(useraccount);
           return;
        }
           
    }
        
   
});

app.listen(keys.port, ()=> {
    console.log("Listening on "+keys.port );
});
// questo comando avvia il server e lo mette in ascolto sulla porta 13765