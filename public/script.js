// --- ЕЛЕМЕНТИ ІНТЕРФЕЙСУ ---
const navMatches = document.getElementById('nav-matches');
const navPlayers = document.getElementById('nav-players');
const navTeams = document.getElementById('nav-teams');
const navSchedules = document.getElementById('nav-schedules');

const matchesSection = document.getElementById('matches-section');
const playersSection = document.getElementById('players-section');
const teamsSection = document.getElementById('teams-section');
const schedulesSection = document.getElementById('schedules-section');
const pageTitle = document.getElementById('page-title');

// --- ЛОГІКА ПЕРЕМИКАННЯ ВКЛАДОК ---
function hideAllSections() {
    matchesSection.style.display = 'none';
    playersSection.style.display = 'none';
    teamsSection.style.display = 'none';
    schedulesSection.style.display = 'none';
    
    navMatches.parentElement.classList.remove('active');
    navPlayers.parentElement.classList.remove('active');
    navTeams.parentElement.classList.remove('active');
    if(navSchedules) navSchedules.parentElement.classList.remove('active');
}

navMatches.addEventListener('click', (e) => {
    e.preventDefault(); hideAllSections();
    navMatches.parentElement.classList.add('active');
    matchesSection.style.display = 'block';
    pageTitle.innerText = 'Управління матчами';
    fetchMatches();
});

navPlayers.addEventListener('click', (e) => {
    e.preventDefault(); hideAllSections();
    navPlayers.parentElement.classList.add('active');
    playersSection.style.display = 'block';
    pageTitle.innerText = 'Склад команди';
    fetchPlayers();
});

navTeams.addEventListener('click', (e) => {
    e.preventDefault(); hideAllSections();
    navTeams.parentElement.classList.add('active');
    teamsSection.style.display = 'block';
    pageTitle.innerText = 'Турнірна таблиця';
    fetchTeams();
});

if(navSchedules) {
    navSchedules.addEventListener('click', (e) => {
        e.preventDefault(); hideAllSections();
        navSchedules.parentElement.classList.add('active');
        schedulesSection.style.display = 'block';
        pageTitle.innerText = 'Розклад матчів';
        fetchSchedules();
    });
}

// ==========================================
// МАТЧІ (РЕЗУЛЬТАТИ)
// ==========================================
const matchForm = document.getElementById('matchForm');
const matchesList = document.getElementById('matchesList');

async function fetchMatches() {
    const response = await fetch('/api/matches');
    const matches = await response.json();
    matchesList.innerHTML = '';
    matches.forEach(match => {
        matchesList.innerHTML += `<div class="match-card">
            <span><strong>${match.homeTeam}</strong> vs <strong>${match.awayTeam}</strong></span>
            <div style="display: flex; gap: 15px; align-items: center;">
                <span class="score">${match.score}</span>
                <button class="btn-delete" onclick="deleteMatch('${match._id}')">❌</button>
            </div></div>`;
    });
}

async function deleteMatch(id) {
    const result = await Swal.fire({ title: 'Видалити?', icon: 'warning', showCancelButton: true });
    if(result.isConfirmed) { await fetch(`/api/matches/${id}`, {method: 'DELETE'}); fetchMatches(); }
}

matchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    await fetch('/api/matches', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            homeTeam: document.getElementById('homeTeam').value,
            awayTeam: document.getElementById('awayTeam').value,
            score: document.getElementById('score').value
        })
    });
    matchForm.reset(); fetchMatches();
});


// ==========================================
// РОЗКЛАД МАЙБУТНІХ МАТЧІВ
// ==========================================
const scheduleForm = document.getElementById('scheduleForm');
const schedulesList = document.getElementById('schedulesList');

async function fetchSchedules() {
    const response = await fetch('/api/schedules');
    const schedules = await response.json();
    schedulesList.innerHTML = '';
    schedules.forEach(s => {
        schedulesList.innerHTML += `<div class="match-card">
            <span><strong>${s.homeTeam}</strong> vs <strong>${s.awayTeam}</strong></span>
            <div style="display: flex; gap: 15px; align-items: center;">
                <span class="score" style="background-color: #f8fafc; border: 1px solid #cbd5e1; color: #334155;">🗓 ${s.matchDate} | ⏰ ${s.matchTime}</span>
                <button class="btn-delete" onclick="deleteSchedule('${s._id}')">❌</button>
            </div></div>`;
    });
}

async function deleteSchedule(id) {
    const result = await Swal.fire({ title: 'Видалити гру з розкладу?', icon: 'warning', showCancelButton: true });
    if(result.isConfirmed) { await fetch(`/api/schedules/${id}`, {method: 'DELETE'}); fetchSchedules(); }
}

if(scheduleForm) {
    scheduleForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await fetch('/api/schedules', { method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                homeTeam: document.getElementById('schHome').value,
                awayTeam: document.getElementById('schAway').value,
                matchDate: document.getElementById('schDate').value,
                matchTime: document.getElementById('schTime').value
            })
        });
        scheduleForm.reset(); fetchSchedules();
    });
}

// ==========================================
// ГРАВЦІ
// ==========================================
const playerForm = document.getElementById('playerForm');
const playersList = document.getElementById('playersList');

async function fetchPlayers() {
    const response = await fetch('/api/players');
    const players = await response.json();
    playersList.innerHTML = '';
    players.forEach(player => {
        playersList.innerHTML += `<div class="match-card">
            <span><strong>#${player.number}</strong> ${player.name}</span>
            <span class="score">${player.position}</span></div>`;
    });
}

playerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    await fetch('/api/players', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: document.getElementById('playerName').value,
            position: document.getElementById('playerPosition').value,
            number: document.getElementById('playerNumber').value
        })
    });
    playerForm.reset(); fetchPlayers();
});

// ==========================================
// ТУРНІРНА ТАБЛИЦЯ
// ==========================================
const teamForm = document.getElementById('teamForm');
const teamsList = document.getElementById('teamsList');

async function fetchTeams() {
    const response = await fetch('/api/teams');
    const teams = await response.json();
    teamsList.innerHTML = '';
    teams.forEach((team, index) => {
        teamsList.innerHTML += `<div class="match-card">
            <span><strong>${index + 1}. ${team.name}</strong> (І: ${team.games}, В: ${team.wins}, Н: ${team.draws}, П: ${team.losses})</span>
            <div style="display: flex; gap: 15px; align-items: center;">
                <span class="score">${team.points} Очок</span>
                <button class="btn-delete" onclick="deleteTeam('${team._id}')">❌</button>
            </div></div>`;
    });
}

async function deleteTeam(id) {
    const result = await Swal.fire({ title: 'Видалити команду?', icon: 'warning', showCancelButton: true });
    if(result.isConfirmed) { await fetch(`/api/teams/${id}`, {method: 'DELETE'}); fetchTeams(); }
}

teamForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    await fetch('/api/teams', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: document.getElementById('teamName').value,
            games: document.getElementById('teamGames').value,
            wins: document.getElementById('teamWins').value,
            draws: document.getElementById('teamDraws').value,
            losses: document.getElementById('teamLosses').value,
            points: document.getElementById('teamPoints').value
        })
    });
    teamForm.reset(); fetchTeams();
});

fetchMatches();