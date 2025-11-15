// src/managers/GameManager.js
export default class GameManager {
    constructor() {
        this.initialized = false;
        this.initializeGameData();
    }
    
    initializeGameData() {
        // Season and league data
        this.season = {
            currentWeek: 1,
            totalWeeks: 17,
            year: 2024,
            playoffs: false
        };
        
        // Player's team data
        this.playerTeam = {
            name: 'Home Team',
            city: 'New York',
            wins: 0,
            losses: 0,
            points: 0,
            pointsAllowed: 0,
            playoffsSeed: 0,
            salary: 50000000, // Salary cap
            facilities: {
                training: 1,
                medical: 1,
                stadium: 1
            }
        };
        
        // Roster management
        this.roster = {
            quarterbacks: [],
            runningBacks: [],
            wideReceivers: [],
            tightEnds: [],
            offensiveLine: [],
            defensiveLine: [],
            linebackers: [],
            defensiveBacks: [],
            kickers: [],
            maxPlayers: 53
        };
        
        // League standings (8 teams for simplicity)
        this.league = this.generateLeague();
        
        // Game statistics
        this.gameStats = {
            totalPassingYards: 0,
            totalRushingYards: 0,
            completions: 0,
            attempts: 0,
            touchdowns: 0,
            interceptions: 0,
            sacks: 0,
            tackles: 0
        };
        
        // Difficulty settings
        this.difficulty = {
            level: 'medium', // easy, medium, hard, extreme
            cpuSkill: 0.5,
            cpuSpeed: 1.0,
            cpuReaction: 1.0
        };
        
        // Achievements
        this.achievements = {
            firstTouchdown: false,
            perfectGame: false,
            comeback: false,
            shutout: false,
            championshipWin: false,
            undefeatedSeason: false
        };
        
        this.initialized = true;
    }
    
    generateLeague() {
        const teams = [
            { name: 'Eagles', city: 'Philadelphia', wins: 0, losses: 0 },
            { name: 'Cowboys', city: 'Dallas', wins: 0, losses: 0 },
            { name: 'Giants', city: 'New York', wins: 0, losses: 0 },
            { name: 'Patriots', city: 'New England', wins: 0, losses: 0 },
            { name: 'Steelers', city: 'Pittsburgh', wins: 0, losses: 0 },
            { name: 'Packers', city: 'Green Bay', wins: 0, losses: 0 },
            { name: '49ers', city: 'San Francisco', wins: 0, losses: 0 },
            { name: 'Chiefs', city: 'Kansas City', wins: 0, losses: 0 }
        ];
        
        return teams.map(team => ({
            ...team,
            points: 0,
            pointsAllowed: 0,
            stats: {
                passingYards: 0,
                rushingYards: 0,
                turnovers: 0
            }
        }));
    }
    
    generatePlayer(position, skill = null) {
        const firstNames = ['Mike', 'John', 'James', 'Robert', 'David', 'Tom', 'Aaron', 'Patrick', 'Josh', 'Lamar'];
        const lastNames = ['Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor'];
        
        // Random skill if not provided
        if (skill === null) {
            skill = Math.floor(Math.random() * 40) + 60; // 60-99 skill rating
        }
        
        const positionStats = this.getPositionStats(position, skill);
        
        return {
            firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
            lastName: lastNames[Math.floor(Math.random() * lastNames.length)],
            position: position,
            number: Math.floor(Math.random() * 99) + 1,
            skill: skill,
            age: Math.floor(Math.random() * 10) + 21, // 21-30 years old
            salary: this.calculateSalary(skill),
            stats: positionStats,
            contract: Math.floor(Math.random() * 4) + 1, // 1-4 years
            morale: 75,
            injury: null
        };
    }
    
    getPositionStats(position, skill) {
        const base = {
            gamesPlayed: 0,
            gamesMissed: 0
        };
        
        switch(position) {
            case 'QB':
                return {
                    ...base,
                    speed: skill * 0.6 + 20,
                    accuracy: skill * 0.8 + 10,
                    power: skill * 0.7 + 15,
                    vision: skill * 0.9,
                    completions: 0,
                    attempts: 0,
                    passingYards: 0,
                    touchdowns: 0,
                    interceptions: 0
                };
            case 'RB':
                return {
                    ...base,
                    speed: skill * 0.9,
                    power: skill * 0.7 + 15,
                    agility: skill * 0.8 + 10,
                    vision: skill * 0.6 + 20,
                    carries: 0,
                    rushingYards: 0,
                    touchdowns: 0,
                    fumbles: 0
                };
            case 'WR':
                return {
                    ...base,
                    speed: skill * 0.95,
                    catching: skill * 0.85 + 5,
                    agility: skill * 0.8 + 10,
                    jumpBall: skill * 0.7 + 15,
                    receptions: 0,
                    receivingYards: 0,
                    touchdowns: 0,
                    drops: 0
                };
            default:
                return {
                    ...base,
                    speed: skill * 0.7 + 15,
                    strength: skill * 0.8 + 10,
                    stamina: skill * 0.6 + 20,
                    technique: skill * 0.75 + 12
                };
        }
    }
    
    calculateSalary(skill) {
        // Higher skill = higher salary
        const baseSalary = 500000;
        const multiplier = skill / 50;
        return Math.floor(baseSalary * multiplier);
    }
    
    startNewSeason() {
        this.season.currentWeek = 1;
        this.season.year++;
        this.season.playoffs = false;
        this.playerTeam.wins = 0;
        this.playerTeam.losses = 0;
        this.playerTeam.points = 0;
        this.playerTeam.pointsAllowed = 0;
        
        // Reset all league teams
        this.league.forEach(team => {
            team.wins = 0;
            team.losses = 0;
            team.points = 0;
            team.pointsAllowed = 0;
        });
        
        // Age players and handle retirements
        this.ageRoster();
    }
    
    ageRoster() {
        Object.keys(this.roster).forEach(position => {
            this.roster[position] = this.roster[position].filter(player => {
                player.age++;
                // Players retire at different ages based on position
                const retirementAge = position === 'kickers' ? 40 : 35;
                return player.age < retirementAge;
            });
        });
    }
    
    advanceWeek() {
        this.season.currentWeek++;
        
        // Simulate other games in the league
        this.simulateLeagueGames();
        
        // Check if regular season is over
        if (this.season.currentWeek > this.season.totalWeeks) {
            this.startPlayoffs();
        }
    }
    
    simulateLeagueGames() {
        // Simple simulation for AI vs AI games
        for (let i = 0; i < this.league.length; i += 2) {
            if (i + 1 < this.league.length) {
                const team1 = this.league[i];
                const team2 = this.league[i + 1];
                
                const score1 = this.simulateScore();
                const score2 = this.simulateScore();
                
                team1.points += score1;
                team2.points += score2;
                team1.pointsAllowed += score2;
                team2.pointsAllowed += score1;
                
                if (score1 > score2) {
                    team1.wins++;
                    team2.losses++;
                } else {
                    team2.wins++;
                    team1.losses++;
                }
            }
        }
    }
    
    simulateScore() {
        // Generate a realistic football score
        return Math.floor(Math.random() * 4) * 7 + Math.floor(Math.random() * 4) * 3 + Math.floor(Math.random() * 7);
    }
    
    startPlayoffs() {
        this.season.playoffs = true;
        // Sort teams by wins
        const standings = this.getStandings();
        console.log('Playoff standings:', standings);
    }
    
    getStandings() {
        // Combine player team with league teams
        const allTeams = [
            { ...this.playerTeam, isPlayer: true },
            ...this.league
        ];
        
        // Sort by wins (descending), then by point differential
        return allTeams.sort((a, b) => {
            if (b.wins !== a.wins) {
                return b.wins - a.wins;
            }
            const diffA = a.points - a.pointsAllowed;
            const diffB = b.points - b.pointsAllowed;
            return diffB - diffA;
        });
    }
    
    recordGameResult(playerScore, opponentScore, opponent) {
        // Update player team record
        this.playerTeam.points += playerScore;
        this.playerTeam.pointsAllowed += opponentScore;
        
        if (playerScore > opponentScore) {
            this.playerTeam.wins++;
            // Award money for winning
            this.playerTeam.salary += 100000;
        } else {
            this.playerTeam.losses++;
        }
        
        // Update opponent record
        const opponentTeam = this.league.find(t => t.name === opponent);
        if (opponentTeam) {
            opponentTeam.points += opponentScore;
            opponentTeam.pointsAllowed += playerScore;
            
            if (opponentScore > playerScore) {
                opponentTeam.wins++;
            } else {
                opponentTeam.losses++;
            }
        }
        
        // Check achievements
        this.checkAchievements(playerScore, opponentScore);
    }
    
    checkAchievements(playerScore, opponentScore) {
        if (playerScore > 0 && !this.achievements.firstTouchdown) {
            this.achievements.firstTouchdown = true;
        }
        
        if (playerScore > 0 && opponentScore === 0) {
            this.achievements.shutout = true;
        }
        
        if (opponentScore - playerScore >= 14 && playerScore > opponentScore) {
            this.achievements.comeback = true;
        }
        
        if (this.playerTeam.wins === this.season.totalWeeks) {
            this.achievements.undefeatedSeason = true;
        }
    }
    
    upgradeFacility(type) {
        const costs = {
            training: [1000000, 2500000, 5000000, 10000000],
            medical: [750000, 2000000, 4000000, 8000000],
            stadium: [2000000, 5000000, 10000000, 20000000]
        };
        
        const currentLevel = this.playerTeam.facilities[type];
        if (currentLevel >= 4) {
            return { success: false, message: 'Max level reached' };
        }
        
        const cost = costs[type][currentLevel - 1];
        if (this.playerTeam.salary < cost) {
            return { success: false, message: 'Not enough funds' };
        }
        
        this.playerTeam.salary -= cost;
        this.playerTeam.facilities[type]++;
        
        return { success: true, message: `${type} upgraded to level ${this.playerTeam.facilities[type]}` };
    }
    
    setDifficulty(level) {
        const settings = {
            easy: { cpuSkill: 0.3, cpuSpeed: 0.8, cpuReaction: 0.7 },
            medium: { cpuSkill: 0.5, cpuSpeed: 1.0, cpuReaction: 1.0 },
            hard: { cpuSkill: 0.7, cpuSpeed: 1.2, cpuReaction: 1.3 },
            extreme: { cpuSkill: 0.9, cpuSpeed: 1.5, cpuReaction: 1.6 }
        };
        
        this.difficulty.level = level;
        Object.assign(this.difficulty, settings[level]);
    }
    
    saveGame() {
        const saveData = {
            season: this.season,
            playerTeam: this.playerTeam,
            roster: this.roster,
            league: this.league,
            gameStats: this.gameStats,
            difficulty: this.difficulty,
            achievements: this.achievements,
            timestamp: Date.now()
        };
        
        // Return the save data object instead of using localStorage
        return saveData;
    }
    
    loadGame(saveData) {
        try {
            this.season = saveData.season;
            this.playerTeam = saveData.playerTeam;
            this.roster = saveData.roster;
            this.league = saveData.league;
            this.gameStats = saveData.gameStats;
            this.difficulty = saveData.difficulty;
            this.achievements = saveData.achievements;
            return true;
        } catch (e) {
            console.error('Failed to load game:', e);
            return false;
        }
    }
}