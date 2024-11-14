const mongoose = require('mongoose');
const Account = mongoose.model('accounts'); // questo mi servira a capire se posso aggiungere nuovi utente, se stanno nomi gia esistenti

//-------Routes(lato sito)
//req->request->richieste http dal client al server(in questo caso è una richiesta GET all'endpoint /account)
//res->response->risposta dal server al client
//get->METODO GET HTTP

    module.exports = app =>{

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
        
        var newAccount = new Account({
            username : rUsername,
            password : rPassword,
        });

    await newAccount.save();
    res.send(newAccount);
    return;

    }else
    {
        if(rPassword == useraccount.password) // vede se password coincide con quella gia inserita nel database
        {
            console.log("Account esistente");
           await useraccount.save();
           res.send(useraccount);
           return;
        }    
    }
    res.send("Password errata"); // questo viene mandato quando sbagli la password
    return;


    });
}