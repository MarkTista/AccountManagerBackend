const express = require('express');
const mongoose = require('mongoose');
const Account = mongoose.model('accounts'); // questo mi servira a capire se posso aggiungere nuovi utente, se stanno nomi gia esistenti

//-------Routes(lato sito)
//req->request->richieste http dal client al server(in questo caso è una richiesta GET all'endpoint /account)
//res->response->risposta dal server al client
//get->METODO GET HTTP

    module.exports = app =>{

    //----Creazione Account----//
    app.get('/account', async (req,res)=>{
    const {rUsername, rPassword} = req.query;
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
    //--------------------------------------------------------------------------------//
   
    //----Per aggiornare i soldi----//
    app.post('/updateCoins', async (req, res) => 
    {
        const { username, gameData } = req.body;
        try {
            const updatedAccount = await Account.findOneAndUpdate(
                { username },                      // Filtra per username
                { $set: { "gameData.coins": gameData.coins } }, // Aggiorna le monete 
                { new: true }                      
            );
            if (updatedAccount) {
                res.status(200).json(updatedAccount);
            } else {
                res.status(404).send('Account non trovato.');
            }
        } catch (error) {
        } 
     });
     //--------------------------------------------------------------------------------//


     //----Per aggiornare inventario+soldi----//
     app.post('/updateInventoryCoins', async (req, res) => {
        const { username, gameData } = req.body;
        try {
            if (!gameData || !gameData.inventory) {
                return res.status(400).json({ message: "Dati mancanti o incompleti" });
            }
            // Itera su ogni elemento dell'inventario
            for (const item of gameData.inventory) {
                // Controlla se l'elemento esiste già
                const existingItem = await Account.findOneAndUpdate(
                    {
                        username,
                        "gameData.inventory.itemName": item.itemName, // Cerca per `itemName`
                    },
                    {
                        $set: { "gameData.inventory.$.quantity": item.quantity }, // Incrementa la quantità
                    },
                    { new: true } // Restituisci il documento aggiornato
                );
    
                if (!existingItem) {
                    // Se l'elemento non esiste, aggiungilo all'inventario
                    await Account.findOneAndUpdate(
                        { username },
                        {
                            $push: {
                                "gameData.inventory": {
                                    itemName: item.itemName, 
                                    quantity: item.quantity, 
                                },
                            },
                        },
                        { new: true }
                    );
                }
            }
            // Aggiorna il valore delle monete
            const finalAccount = await Account.findOneAndUpdate(
                { username },
                { $set: { "gameData.coins": gameData.coins } }, // Aggiorna le monete
                { new: true }
            );
            // Restituisci il risultato aggiornato
            res.status(200).json(finalAccount);
        } catch (error) {
        }
    });
    //--------------------------------------------------------------------------------//
    app.post('/DeleteInventoryItem', async (req, res) => {
        const { username, itemName } = req.body; // Usa `itemName` per identificare l'elemento
        try {
            // Trova l'elemento nell'inventario
            const item = account.gameData.inventory.find(i => i.itemName === itemName);

            if (item.quantity > 1) {
                // Diminuisci la quantità di 1
                const updatedAccount = await Account.findOneAndUpdate(
                    { username, "gameData.inventory.itemName": itemName },
                    { $inc: { "gameData.inventory.$.quantity": -1 } }, // Decrementa di 1
                    { new: true }
                );
                return res.status(200).json({ message: "Quantità aggiornata", updatedAccount });
            } else {
                // Se la quantità è 1, rimuovi completamente l'elemento
                const updatedAccount = await Account.findOneAndUpdate(
                    { username },
                    { $pull: { "gameData.inventory": { itemName } } }, // Rimuovi per `itemName`
                    { new: true }
                );
    
                return res.status(200).json({ message: "Elemento rimosso", updatedAccount });
            }
        } catch (error) {
        }
    });
    

    
    
    
    
    
    
}