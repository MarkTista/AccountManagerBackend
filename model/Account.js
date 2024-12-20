const mongoose = require('mongoose'); // Importa il modulo mongoose
const { Schema } = mongoose; // Estrai la classe Schema

// Definizione dello schema per l'inventario
const inventoryItemSchema = new Schema({
    itemName: { type: String, required: true }, 
    quantity: { type: Number, default: 1 },    
});

// Definizione dello schema per l'account
const accountSchema = new Schema({
    username: { type: String, required: true, unique: true }, 
    password: { type: String, required: true },               
    gameData: {                                               
        coins: { type: Number, default: 100 },                   
        level: { type: Number, default: 1 },                   
        inventory: [inventoryItemSchema]                      
    }
});

// Registra il modello nello schema 'accounts'
mongoose.model('accounts', accountSchema);
