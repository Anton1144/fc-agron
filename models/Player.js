const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
    name: { type: String, required: true },      
    position: { type: String, required: true },  
    number: { type: Number, required: true },   
    goals: { type: Number, default: 0 }          
});

module.exports = mongoose.model('Player', playerSchema);