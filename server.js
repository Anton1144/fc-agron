require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Підключаємо моделі бази даних
const Match = require('./models/Match');
const Player = require('./models/Player');
const Team = require('./models/Team');
const Schedule = require('./models/Schedule');

const app = express();

// Мідлвари
app.use(cors());
app.use(express.json()); 
app.use(express.static('public')); // Роздає фронтенд з папки public

// Підключення до MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('✅ Підключено до MongoDB');
        seedDatabase(); // Запуск автоматичного наповнення після підключення
    })
    .catch(err => console.error('Помилка підключення до БД:', err));


// ==========================================
// АВТОМАТИЧНЕ НАПОВНЕННЯ БАЗИ (SEEDING)
// ==========================================
// ==========================================
// АВТОМАТИЧНЕ НАПОВНЕННЯ БАЗИ (SEEDING)
// ==========================================
// ==========================================
// АВТОМАТИЧНЕ НАПОВНЕННЯ БАЗИ (SEEDING)
// ==========================================
const initialTeams = [
    { name: 'Агрон', games: 18, wins: 10, draws: 5, losses: 3, points: 35 },
    { name: 'Дністер', games: 18, wins: 10, draws: 4, losses: 4, points: 34 },
    { name: 'Корміл', games: 18, wins: 7, draws: 8, losses: 3, points: 29 },
    { name: 'ФК Миколаїв', games: 18, wins: 9, draws: 2, losses: 7, points: 29 },
    { name: 'Маяк', games: 18, wins: 7, draws: 6, losses: 5, points: 27 },
    { name: 'ФК Тростянець', games: 18, wins: 6, draws: 7, losses: 5, points: 25 },
    { name: 'VIVAD', games: 18, wins: 5, draws: 6, losses: 7, points: 21 },
    { name: 'Колос', games: 18, wins: 5, draws: 5, losses: 8, points: 20 },
    { name: 'ФК Костопіль', games: 18, wins: 3, draws: 3, losses: 12, points: 12 },
    { name: 'СК Коростень/Агро-Нива', games: 18, wins: 1, draws: 8, losses: 9, points: 11 }
];

const initialMatches = [
    { homeTeam: 'Агрон', awayTeam: 'Дністер', score: '2:1' },
    { homeTeam: 'Корміл', awayTeam: 'Агрон', score: '0:0' },
    { homeTeam: 'Агрон', awayTeam: 'ФК Миколаїв', score: '3:0' },
    { homeTeam: 'Маяк', awayTeam: 'Агрон', score: '1:2' },
    { homeTeam: 'Агрон', awayTeam: 'ФК Тростянець', score: '1:1' }
];

// НОВЕ: Реальний склад ФК Агрон
const defaultPlayers = [
            // Воротарі
            { number: 1, name: 'Руслан Мазур', position: 'Воротар' },
            { number: 12, name: 'Іван Рогаль', position: 'Воротар' },
            // Захисники
            { number: 2, name: 'Віктор Ковалик', position: 'Захисник' },
            { number: 3, name: 'Іван Олексюк', position: 'Захисник' },
            { number: 4, name: 'Андрій Скакун', position: 'Захисник' },
            { number: 5, name: 'Роман Скородень', position: 'Захисник' },
            { number: 13, name: 'Юрій Соколовський', position: 'Захисник' },
            { number: 14, name: 'Дмитро Стриєшин', position: 'Захисник' },
            { number: 33, name: 'Євген Щербатюк', position: 'Захисник' },
            // Півзахисники
            { number: 6, name: 'Ігор Кохман', position: 'Півзахисник' },
            { number: 7, name: 'Руслан Луцик', position: 'Півзахисник' },
            { number: 8, name: 'Володимир Онищук', position: 'Півзахисник' },
            { number: 15, name: 'Станіслав Павлович', position: 'Півзахисник' },
            { number: 16, name: 'Максим Пежинський', position: 'Півзахисник' },
            { number: 17, name: 'Олександр Понєдєльнік', position: 'Півзахисник' },
            { number: 18, name: 'Володимир Пришнівський', position: 'Півзахисник' },
            { number: 19, name: 'Тарас Семенець', position: 'Півзахисник' },
            // Нападники
            { number: 9, name: 'Михайло Войцещук', position: 'Нападник' },
            { number: 10, name: 'Тарас Громяк', position: 'Нападник' },
            { number: 11, name: 'Роман Мельник', position: 'Нападник' }
        ];

async function seedDatabase() {
    try {
        const teamCount = await Team.countDocuments();
        if (teamCount === 0) { await Team.insertMany(initialTeams); console.log('✅ Таблицю команд заповнено!'); }

        const matchCount = await Match.countDocuments();
        if (matchCount === 0) { await Match.insertMany(initialMatches); console.log('✅ Останні матчі додано!'); }

        // Додаємо перевірку складу гравців
        const playerCount = await Player.countDocuments();
        if (playerCount === 0) {
            await Player.insertMany(defaultPlayers); 
            console.log('✅ Склад команди успішно додано (22 гравці)!'); 
        }
    } catch (error) {
        console.error('Помилка при наповненні бази:', error);
    }
}
// ==========================================
// API ДЛЯ МАТЧІВ
// ==========================================

// Отримати всі матчі (GET)
app.get('/api/matches', async (req, res) => {
    try {
        const matches = await Match.find().sort({ date: -1 });
        res.json(matches);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Додати новий матч (POST)
app.post('/api/matches', async (req, res) => {
    const { homeTeam, awayTeam, score } = req.body;
    const newMatch = new Match({ homeTeam, awayTeam, score });
    try {
        const savedMatch = await newMatch.save();
        res.status(201).json(savedMatch);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Видалити матч (DELETE)
app.delete('/api/matches/:id', async (req, res) => {
    try {
        await Match.findByIdAndDelete(req.params.id);
        res.json({ message: 'Матч успішно видалено' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// ==========================================
// API ДЛЯ ГРАВЦІВ
// ==========================================

// Отримати всіх гравців (GET)
app.get('/api/players', async (req, res) => {
    try {
        const players = await Player.find().sort({ number: 1 }); 
        res.json(players);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Додати нового гравця (POST)
app.post('/api/players', async (req, res) => {
    const { name, position, number } = req.body;
    const newPlayer = new Player({ name, position, number });
    try {
        const savedPlayer = await newPlayer.save();
        res.status(201).json(savedPlayer);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});
// Видалення гравця
app.delete('/api/players/:id', async (req, res) => {
    try {
        await Player.findByIdAndDelete(req.params.id);
        res.json({ message: 'Гравця успішно видалено' });
    } catch (err) {
        res.status(500).json({ error: 'Помилка видалення гравця' });
    }
});

// ==========================================
// API ДЛЯ КОМАНД (ТУРНІРНА ТАБЛИЦЯ)
// ==========================================

// Отримати всі команди (GET)
app.get('/api/teams', async (req, res) => {
    try {
        const teams = await Team.find().sort({ points: -1 });
        res.json(teams);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Додати нову команду (POST)
app.post('/api/teams', async (req, res) => {
    const { name, games, wins, draws, losses, points } = req.body;
    const newTeam = new Team({ name, games, wins, draws, losses, points });
    try {
        const savedTeam = await newTeam.save();
        res.status(201).json(savedTeam);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Видалити команду (DELETE)
app.delete('/api/teams/:id', async (req, res) => {
    try {
        await Team.findByIdAndDelete(req.params.id);
        res.json({ message: 'Команду успішно видалено' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
// ==========================================
// API ДЛЯ РОЗКЛАДУ МАЙБУТНІХ МАТЧІВ
// ==========================================

// Отримати всі майбутні матчі
app.get('/api/schedules', async (req, res) => {
    try {
        const schedules = await Schedule.find();
        res.json(schedules);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Додати новий матч у розклад
app.post('/api/schedules', async (req, res) => {
    const { homeTeam, awayTeam, matchDate, matchTime } = req.body;
    const newSchedule = new Schedule({ homeTeam, awayTeam, matchDate, matchTime });
    try {
        const savedSchedule = await newSchedule.save();
        res.status(201).json(savedSchedule);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Видалити матч з розкладу
app.delete('/api/schedules/:id', async (req, res) => {
    try {
        await Schedule.findByIdAndDelete(req.params.id);
        res.json({ message: 'Матч успішно видалено з розкладу' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ==========================================
// API ДЛЯ АВТОРИЗАЦІЇ
// ==========================================
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === 'admin123') {
        res.json({ success: true });
    } else {
        res.status(401).json({ success: false, message: 'Невірний логін або пароль' });
    }
});


// ==========================================
// ЗАПУСК СЕРВЕРА
// ==========================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Сервер працює на порту http://localhost:${PORT}`);
});