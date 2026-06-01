const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
    homeTeam: { type: String, required: true },
    awayTeam: { type: String, required: true },
    score: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Match', matchSchema);