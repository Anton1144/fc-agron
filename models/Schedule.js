const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
    homeTeam: { type: String, required: true },  // Команда господарів
    awayTeam: { type: String, required: true },  // Команда гостей
    matchDate: { type: String, required: true }, // Дата (наприклад: "15 Червня")
    matchTime: { type: String, required: true }  // Час (наприклад: "18:00")
});

module.exports = mongoose.model('Schedule', scheduleSchema);