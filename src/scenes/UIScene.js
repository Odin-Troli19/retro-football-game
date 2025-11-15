// src/scenes/UIScene.js
export default class UIScene extends Phaser.Scene {
    constructor() {
        super('UIScene');
    }
    
    init(data) {
        this.gameScene = data.gameScene;
    }
    
    create() {
        const { width, height } = this.cameras.main;
        
        // Create HUD elements
        this.createScoreboard(width);
        this.createDownDisplay(width, height);
        this.createPlayClock(width);
        this.createStaminaBar();
        this.createMinimap(width, height);
        this.createPauseMenu(width, height);
        
        // Listen for game events
        this.setupEventListeners();
        
        // Controls
        this.pauseKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        
        // Update loop
        this.updateInterval = this.time.addEvent({
            delay: 100,
            callback: this.updateHUD,
            callbackScope: this,
            loop: true
        });
    }
    
    createScoreboard(width) {
        // Scoreboard background
        const scoreboardBg = this.add.rectangle(width / 2, 30, 400, 50, 0x000000, 0.7);
        scoreboardBg.setStrokeStyle(2, 0xffd700);
        
        // Team names and scores
        this.homeTeamText = this.add.text(width / 2 - 150, 20, 'HOME', {
            fontSize: '16px',
            fontFamily: 'Arial Black',
            color: '#ffffff'
        });
        
        this.homeScoreText = this.add.text(width / 2 - 150, 35, '0', {
            fontSize: '20px',
            fontFamily: 'Arial Black',
            color: '#00ff00'
        });
        
        this.awayTeamText = this.add.text(width / 2 + 80, 20, 'AWAY', {
            fontSize: '16px',
            fontFamily: 'Arial Black',
            color: '#ffffff'
        });
        
        this.awayScoreText = this.add.text(width / 2 + 80, 35, '0', {
            fontSize: '20px',
            fontFamily: 'Arial Black',
            color: '#ff0000'
        });
        
        // Quarter and time
        this.quarterText = this.add.text(width / 2 - 30, 20, 'Q1', {
            fontSize: '14px',
            fontFamily: 'Arial',
            color: '#ffffff'
        });
        
        this.timeText = this.add.text(width / 2 - 30, 35, '15:00', {
            fontSize: '16px',
            fontFamily: 'Arial',
            color: '#ffff00'
        });
        
        // Store in container for easy access
        this.scoreboard = {
            bg: scoreboardBg,
            homeTeam: this.homeTeamText,
            homeScore: this.homeScoreText,
            awayTeam: this.awayTeamText,
            awayScore: this.awayScoreText,
            quarter: this.quarterText,
            time: this.timeText
        };
    }
    
    createDownDisplay(width, height) {
        // Down and distance display
        const downBg = this.add.rectangle(width / 2, height - 30, 300, 40, 0x000000, 0.7);
        downBg.setStrokeStyle(2, 0xffd700);
        
        this.downText = this.add.text(width / 2, height - 30, '1st & 10', {
            fontSize: '20px',
            fontFamily: 'Arial Black',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        this.fieldPositionText = this.add.text(width / 2, height - 50, 'OWN 20', {
            fontSize: '14px',
            fontFamily: 'Arial',
            color: '#aaaaaa'
        }).setOrigin(0.5);
    }
    
    createPlayClock(width) {
        // Play clock (40 seconds between plays)
        this.playClockBg = this.add.rectangle(width - 60, 80, 100, 40, 0x000000, 0.7);
        this.playClockBg.setStrokeStyle(2, 0xff0000);
        
        this.playClockText = this.add.text(width - 60, 80, '40', {
            fontSize: '24px',
            fontFamily: 'Arial Black',
            color: '#ff0000'
        }).setOrigin(0.5);
        
        this.playClock = 40;
    }
    
    createStaminaBar() {
        // Stamina bar for active player
        const barWidth = 150;
        const barHeight = 15;
        
        this.staminaBg = this.add.rectangle(75, 80, barWidth, barHeight, 0x000000, 0.7);
        this.staminaBg.setStrokeStyle(1, 0xffffff);
        
        this.staminaBar = this.add.rectangle(75 - barWidth / 2, 80, barWidth, barHeight - 2, 0x00ff00);
        this.staminaBar.setOrigin(0, 0.5);
        
        this.staminaText = this.add.text(75, 95, 'STAMINA', {
            fontSize: '10px',
            fontFamily: 'Arial',
            color: '#ffffff'
        }).setOrigin(0.5);
    }
    
    createMinimap(width, height) {
        // Simple minimap showing player positions
        this.minimapBg = this.add.rectangle(width - 80, height - 80, 140, 90, 0x1a4d2e, 0.8);
        this.minimapBg.setStrokeStyle(2, 0xffd700);
        
        this.minimapText = this.add.text(width - 80, height - 120, 'FIELD', {
            fontSize: '10px',
            fontFamily: 'Arial',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        // Minimap will show player dots
        this.minimapPlayers = [];
    }
    
    createPauseMenu(width, height) {
        // Pause menu (hidden by default)
        this.pauseOverlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.8);
        this.pauseOverlay.setOrigin(0);
        this.pauseOverlay.setVisible(false);
        this.pauseOverlay.setInteractive();
        
        this.pauseText = this.add.text(width / 2, height / 2 - 100, 'PAUSED', {
            fontSize: '48px',
            fontFamily: 'Arial Black',
            color: '#ffffff'
        }).setOrigin(0.5);
        this.pauseText.setVisible(false);
        
        // Pause menu options
        this.pauseMenuItems = [
            { text: 'RESUME', action: () => this.resumeGame() },
            { text: 'RESTART', action: () => this.restartGame() },
            { text: 'SETTINGS', action: () => this.openSettings() },
            { text: 'QUIT TO MENU', action: () => this.quitToMenu() }
        ];
        
        this.pauseButtons = [];
        let yPos = height / 2 - 20;
        
        this.pauseMenuItems.forEach((item, index) => {
            const button = this.add.text(width / 2, yPos, item.text, {
                fontSize: '24px',
                fontFamily: 'Arial Black',
                color: '#ffffff'
            }).setOrigin(0.5);
            button.setInteractive();
            button.setVisible(false);
            
            button.on('pointerover', () => {
                button.setColor('#ffff00');
            });
            
            button.on('pointerout', () => {
                button.setColor('#ffffff');
            });
            
            button.on('pointerdown', () => {
                item.action();
            });
            
            this.pauseButtons.push(button);
            yPos += 50;
        });
        
        this.isPaused = false;
    }
    
    setupEventListeners() {
        // Listen for score updates
        if (this.gameScene) {
            this.gameScene.events.on('scoreUpdate', this.updateScore, this);
            this.gameScene.events.on('downUpdate', this.updateDown, this);
            this.gameScene.events.on('timeUpdate', this.updateTime, this);
        }
    }
    
    updateHUD() {
        if (!this.gameScene || this.isPaused) return;
        
        // Update score
        if (this.gameScene.score) {
            this.scoreboard.homeScore.setText(this.gameScene.score.player.toString());
            this.scoreboard.awayScore.setText(this.gameScene.score.cpu.toString());
        }
        
        // Update down and distance
        if (this.gameScene.currentDown && this.gameScene.yardsToGo) {
            const downText = this.getDownText(this.gameScene.currentDown);
            this.downText.setText(`${downText} & ${this.gameScene.yardsToGo}`);
        }
        
        // Update time
        if (this.gameScene.timeRemaining !== undefined) {
            const minutes = Math.floor(this.gameScene.timeRemaining / 60);
            const seconds = this.gameScene.timeRemaining % 60;
            this.timeText.setText(`${minutes}:${seconds.toString().padStart(2, '0')}`);
        }
        
        // Update quarter
        if (this.gameScene.quarter) {
            this.quarterText.setText(`Q${this.gameScene.quarter}`);
        }
        
        // Update stamina
        if (this.gameScene.activePlayer && this.gameScene.activePlayer.stamina !== undefined) {
            const staminaPercent = this.gameScene.activePlayer.stamina / this.gameScene.activePlayer.maxStamina;
            this.staminaBar.width = 148 * staminaPercent;
            
            // Color based on stamina level
            if (staminaPercent > 0.6) {
                this.staminaBar.setFillStyle(0x00ff00);
            } else if (staminaPercent > 0.3) {
                this.staminaBar.setFillStyle(0xffff00);
            } else {
                this.staminaBar.setFillStyle(0xff0000);
            }
        }
    }
    
    getDownText(down) {
        switch(down) {
            case 1: return '1st';
            case 2: return '2nd';
            case 3: return '3rd';
            case 4: return '4th';
            default: return '1st';
        }
    }
    
    updateScore(playerScore, cpuScore) {
        this.scoreboard.homeScore.setText(playerScore.toString());
        this.scoreboard.awayScore.setText(cpuScore.toString());
        
        // Flash effect
        this.tweens.add({
            targets: this.scoreboard.homeScore,
            scaleX: 1.5,
            scaleY: 1.5,
            duration: 200,
            yoyo: true,
            ease: 'Power2'
        });
    }
    
    updateDown(down, yardsToGo) {
        const downText = this.getDownText(down);
        this.downText.setText(`${downText} & ${yardsToGo}`);
    }
    
    updateTime(timeRemaining) {
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        this.timeText.setText(`${minutes}:${seconds.toString().padStart(2, '0')}`);
    }
    
    update() {
        // Check for pause input
        if (Phaser.Input.Keyboard.JustDown(this.pauseKey)) {
            this.togglePause();
        }
    }
    
    togglePause() {
        this.isPaused = !this.isPaused;
        
        if (this.isPaused) {
            // Pause the game
            if (this.gameScene) {
                this.gameScene.scene.pause();
            }
            
            // Show pause menu
            this.pauseOverlay.setVisible(true);
            this.pauseText.setVisible(true);
            this.pauseButtons.forEach(btn => btn.setVisible(true));
        } else {
            // Resume the game
            this.resumeGame();
        }
    }
    
    resumeGame() {
        this.isPaused = false;
        
        if (this.gameScene) {
            this.gameScene.scene.resume();
        }
        
        this.pauseOverlay.setVisible(false);
        this.pauseText.setVisible(false);
        this.pauseButtons.forEach(btn => btn.setVisible(false));
    }
    
    restartGame() {
        if (this.gameScene) {
            this.gameScene.scene.restart();
        }
        this.resumeGame();
    }
    
    openSettings() {
        // Open settings scene as overlay
        this.scene.launch('SettingsScene');
    }
    
    quitToMenu() {
        if (this.gameScene) {
            this.gameScene.scene.stop();
        }
        this.scene.stop();
        this.scene.start('MenuScene');
    }
}