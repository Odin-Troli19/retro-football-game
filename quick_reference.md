# 🏈 QUICK REFERENCE GUIDE

## 📁 Files Created (8 Enhanced Files)

1. ✅ **GameManager.js** - Complete season/team management
2. ✅ **AudioManager.js** - Full audio system  
3. ✅ **Ball.js** - Realistic ball physics
4. ✅ **Player-Enhanced.js** - 9 positions, AI, stats
5. ✅ **MenuScene.js** - Professional menus
6. ✅ **UIScene.js** - Complete HUD
7. ✅ **PreloadScene.js** - Asset loading
8. ✅ **package.json** + **webpack.config.js** + **README.md**

## ⚡ Quick Commands

```bash
# Install
npm install

# Run dev server
npm start

# Build production
npm run build
```

## 🎮 Player Positions Quick Ref

| Position | Code | Key Stats | Role |
|----------|------|-----------|------|
| Quarterback | QB | Accuracy, Power | Pass |
| Running Back | RB | Speed, Agility | Run |
| Wide Receiver | WR | Speed, Catching | Receive |
| Tight End | TE | Catching, Blocking | Both |
| Offensive Line | OL | Strength, Blocking | Block |
| Defensive Line | DL | Strength, Rush | Sack |
| Linebacker | LB | Tackling, Coverage | Defend |
| Defensive Back | DB | Speed, Coverage | Cover |
| Kicker | K | Power, Accuracy | Kick |

## 🎯 GameManager API

```javascript
// Access from any scene
const gm = this.game.gameManager;

// Season management
gm.advanceWeek();
gm.startNewSeason();
gm.getStandings();

// Player creation
const player = gm.generatePlayer('QB', 85); // position, skill

// Facilities
gm.upgradeFacility('training'); // costs money

// Difficulty
gm.setDifficulty('hard'); // easy/medium/hard/extreme

// Game results
gm.recordGameResult(28, 14, 'Cowboys');

// Save/load
const saveData = gm.saveGame();
gm.loadGame(saveData);
```

## 🔊 AudioManager API

```javascript
// Access
const audio = this.game.audioManager;

// Music
audio.playMusic('game-music');
audio.stopMusic();

// SFX
audio.playSFX('tackle');
audio.playTackleSound(); // with variation
audio.playTouchdownSequence();

// Volume
audio.setMusicVolume(0.7);
audio.setSFXVolume(0.8);
audio.toggleMute();
```

## ⚽ Ball API

```javascript
// Throw
ball.throwTo(thrower, target, power, arc);
// power: 0.0-1.0, arc: 0.5-2.0

// Kick
ball.kick(kicker, angle, power, isFieldGoal);

// Fumble
ball.fumble({ x: force, y: force });

// Attach to player
ball.attachToCarrier(player);

// Pick up loose ball
ball.pickUp(player);
```

## 🏃 Player API

```javascript
// Movement
player.run({ x: 1, y: 0 });
player.stop();
player.sprint(true/false);

// Ball handling
player.receiveBall();
player.throwBall(target);
player.catchBall();

// Special moves
player.juke({ x: 1, y: 0 });
player.spin();
player.stiffArm();

// Tackling
player.tackle(targetPlayer);

// AI
player.isAI = true;
player.aiState = 'running'; // idle/running/blocking/covering/tackling
```

## 📊 Difficulty Settings

```javascript
{
    easy: { 
        cpuSkill: 0.3,    // 30% 
        cpuSpeed: 0.8,    // 80%
        cpuReaction: 0.7  // 70%
    },
    medium: { 
        cpuSkill: 0.5,    // 50%
        cpuSpeed: 1.0,    // 100%
        cpuReaction: 1.0  // 100%
    },
    hard: { 
        cpuSkill: 0.7,    // 70%
        cpuSpeed: 1.2,    // 120%
        cpuReaction: 1.3  // 130%
    },
    extreme: { 
        cpuSkill: 0.9,    // 90%
        cpuSpeed: 1.5,    // 150%
        cpuReaction: 1.6  // 160%
    }
}
```

## 🎨 Scene Flow

```
BootScene 
    ↓
PreloadScene (loads assets, creates managers)
    ↓
MenuScene (main menu)
    ↓
GameScene (gameplay) + UIScene (HUD)
    ↓
PostGameScene (results)
    ↓
MenuScene (back to menu)
```

## 🎯 Common Code Snippets

### Create a Touchdown
```javascript
// In GameScene
this.score.player += 7; // or 6 for TD + miss XP
this.events.emit('scoreUpdate', this.score.player, this.score.cpu);
if (this.audioManager) {
    this.audioManager.playTouchdownSequence();
}
```

### Switch Controlled Player
```javascript
// In GameScene
switchPlayer() {
    const nextIndex = (this.playerTeam.indexOf(this.activePlayer) + 1) 
                      % this.playerTeam.length;
    this.activePlayer = this.playerTeam[nextIndex];
    this.cameras.main.startFollow(this.activePlayer);
}
```

### Generate a Team
```javascript
// Create roster
const roster = {
    quarterbacks: [],
    runningBacks: [],
    wideReceivers: []
};

// Add players
roster.quarterbacks.push(gameManager.generatePlayer('QB', 85));
roster.runningBacks.push(gameManager.generatePlayer('RB', 82));
roster.wideReceivers.push(gameManager.generatePlayer('WR', 88));
```

### Pass Completion Check
```javascript
// In GameScene after ball thrown
ball.on('flightComplete', () => {
    const distance = Phaser.Math.Distance.Between(
        ball.x, ball.y, 
        ball.target.x, ball.target.y
    );
    
    if (distance < 30) {
        // Successful catch
        const catchSuccess = ball.target.catchBall();
        if (catchSuccess) {
            ball.attachToCarrier(ball.target);
            this.audioManager.playSFX('catch');
        }
    } else {
        // Incomplete
        ball.makeLoose();
    }
});
```

## 🔥 Performance Tips

```javascript
// Use object pooling
this.playerPool = this.add.group({
    classType: Player,
    maxSize: 22,
    runChildUpdate: true
});

// Optimize collisions
this.physics.add.overlap(
    this.playerTeam, 
    this.ball, 
    this.handleBallPickup,
    null,
    this
);

// Limit draw calls
this.cameras.main.roundPixels = true;
```

## 🐛 Debug Commands

```javascript
// In browser console

// Check game state
game.gameManager.season
game.gameManager.playerTeam
game.gameManager.getStandings()

// Test audio
game.audioManager.playSFX('touchdown')
game.audioManager.playMusic('victory-music')

// Check active scene
game.scene.scenes.map(s => s.scene.key)

// Get ball info
game.scene.scenes.find(s => s.ball).ball
```

## 📋 Checklist for Integration

- [ ] Copy all enhanced files to src/
- [ ] Update package.json
- [ ] Run `npm install`
- [ ] Create assets/ folder structure  
- [ ] Update main.js scene array
- [ ] Test basic menu navigation
- [ ] Test game start/stop
- [ ] Test audio (can be mocked)
- [ ] Verify ball physics
- [ ] Test player movement
- [ ] Check UI displays
- [ ] Test pause menu
- [ ] Verify season advancement

## 🎊 Feature Count

- **8** Enhanced/new files
- **2000+** Lines of code
- **50+** New features
- **9** Player positions
- **4** Difficulty levels
- **5** Achievements
- **17** Week season
- **10+** Sound effects
- **3** Facility types
- **53** Max roster size

## 💾 Asset Requirements (Minimum)

```
assets/
├── audio/
│   ├── music/ (3 files: menu, game, victory)
│   └── sfx/ (13 files)
├── images/
│   ├── backgrounds/ (field.png)
│   ├── sprites/ (players.png 32x32, ball.png 16x16)
│   └── ui/ (buttons, panels)
```

Can use placeholders during development!

## 🚀 Build Commands

```bash
# Development (hot reload)
npm start

# Production build
npm run build

# Watch mode
npm run watch

# Serve production
npx http-server dist
```

---

**Remember**: Test each system independently before integrating everything!

Good luck! 🏈