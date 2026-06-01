const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    name: { type: String, required: true },      // Назва команди
    games: { type: Number, default: 0 },         // Ігри
    wins: { type: Number, default: 0 },          // Перемоги
    draws: { type: Number, default: 0 },         // Нічиї
    losses: { type: Number, default: 0 },        // Поразки
    points: { type: Number, default: 0 }         // Очки
});

module.exports = mongoose.model('Team', teamSchema);