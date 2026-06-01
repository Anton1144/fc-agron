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
const initialPlayers = [
    { number: 1, name: 'Андрієшин Роман', position: 'Дата нар.: 02.08.1996' },
    { number: 2, name: 'Білик Валентин', position: 'Дата нар.: 29.07.1996' },
    { number: 3, name: 'Ваврик Андрій', position: 'Дата нар.: 28.05.2002' },
    { number: 4, name: 'Гром\'як Тарас', position: 'Дата нар.: 19.03.1993' },
    { number: 5, name: 'Кобеля Олександр', position: 'Дата нар.: 28.02.2002' },
    { number: 6, name: 'Ковалик Віктор', position: 'Дата нар.: 19.10.1984' },
    { number: 7, name: 'Кохман Ігор', position: 'Дата нар.: 18.06.1997' },
    { number: 8, name: 'Луцик Руслан', position: 'Дата нар.: 09.04.1996' },
    { number: 9, name: 'Мазур Руслан', position: 'Дата нар.: 02.10.1991' },
    { number: 10, name: 'Махінка Денис-Павло', position: 'Дата нар.: 14.03.2003' },
    { number: 11, name: 'Мостовий Володимир', position: 'Дата нар.: 28.09.2001' },
    { number: 12, name: 'Олексюк Іван', position: 'Дата нар.: 08.07.1995' },
    { number: 13, name: 'Онищук Володимир', position: 'Дата нар.: 20.03.2000' },
    { number: 14, name: 'Понедельнік Олександр', position: 'Дата нар.: 04.06.1999' },
    { number: 15, name: 'Пришнівський Володимир', position: 'Дата нар.: 26.07.1992' },
    { number: 16, name: 'Рогаль Іван', position: 'Дата нар.: 20.01.1998' },
    { number: 17, name: 'Семенець Богдан', position: 'Дата нар.: 27.11.1990' },
    { number: 18, name: 'Скакун Андрій', position: 'Дата нар.: 13.09.1994' },
    { number: 19, name: 'Соколовський Юрій', position: 'Дата нар.: 11.04.1995' },
    { number: 20, name: 'Тяпкін Максим', position: 'Дата нар.: 05.01.2001' },
    { number: 21, name: 'Федчишин Іван', position: 'Дата нар.: 27.06.2002' },
    { number: 22, name: 'Щербатюк Євген', position: 'Дата нар.: 20.11.1997' }
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
            await Player.insertMany(initialPlayers); 
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