// src/scenes/MenuScene.js
export default class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }
    
    create() {
        const { width, height } = this.cameras.main;
        
        // Background
        this.add.rectangle(0, 0, width, height, 0x1a4d2e).setOrigin(0);
        
        // Title
        const titleStyle = {
            fontSize: '48px',
            fontFamily: 'Arial Black',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 6
        };
        
        this.add.text(width / 2, 80, 'RETRO FOOTBALL', titleStyle).setOrigin(0.5);
        
        // Subtitle
        this.add.text(width / 2, 130, 'GRIDIRON GLORY', {
            fontSize: '20px',
            fontFamily: 'Arial',
            color: '#ffd700'
        }).setOrigin(0.5);
        
        // Menu options
        const menuItems = [
            { text: 'SEASON MODE', scene: 'TeamManagementScene', action: () => this.startSeason() },
            { text: 'QUICK PLAY', scene: 'GameScene', action: () => this.startQuickPlay() },
            { text: 'STANDINGS', scene: 'StandingsScene' },
            { text: 'ACHIEVEMENTS', action: () => this.showAchievements() },
            { text: 'SETTINGS', scene: 'SettingsScene' },
            { text: 'CONTINUE', action: () => this.continue(), checkSave: true }
        ];
        
        this.menuButtons = [];
        let yPos = 200;
        
        menuItems.forEach((item, index) => {
            // Check if continue option should be shown
            if (item.checkSave && !this.checkForSave()) {
                return; // Skip continue if no save exists
            }
            
            const button = this.createMenuButton(width / 2, yPos, item.text, () => {
                this.selectOption(item);
            });
            
            this.menuButtons.push(button);
            yPos += 60;
        });
        
        // Selected index
        this.selectedIndex = 0;
        this.highlightButton(this.selectedIndex);
        
        // Controls
        this.cursors = this.input.keyboard.createCursorKeys();
        this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        
        // Controls hint
        this.add.text(width / 2, height - 40, 'USE ARROW KEYS TO NAVIGATE • ENTER OR SPACE TO SELECT', {
            fontSize: '12px',
            fontFamily: 'Arial',
            color: '#aaaaaa'
        }).setOrigin(0.5);
        
        // Version
        this.add.text(10, height - 20, 'v2.0 Enhanced Edition', {
            fontSize: '10px',
            fontFamily: 'Arial',
            color: '#666666'
        });
        
        // Play menu music if audio manager exists
        if (this.audioManager) {
            this.audioManager.playMusic('menu-music');
        }
    }
    
    createMenuButton(x, y, text, callback) {
        const container = this.add.container(x, y);
        
        // Button background
        const bg = this.add.rectangle(0, 0, 300, 45, 0x2d5f3f);
        bg.setStrokeStyle(2, 0x4a7c59);
        
        // Button text
        const buttonText = this.add.text(0, 0, text, {
            fontSize: '20px',
            fontFamily: 'Arial Black',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        container.add([bg, buttonText]);
        container.setSize(300, 45);
        container.setInteractive();
        
        // Hover effect
        container.on('pointerover', () => {
            bg.setFillStyle(0x3d7f5f);
            if (this.audioManager) {
                this.audioManager.playSFX('buttonClick');
            }
        });
        
        container.on('pointerout', () => {
            bg.setFillStyle(0x2d5f3f);
        });
        
        container.on('pointerdown', () => {
            if (callback) callback();
        });
        
        // Store references
        container.bg = bg;
        container.buttonText = buttonText;
        
        return container;
    }
    
    highlightButton(index) {
        // Reset all buttons
        this.menuButtons.forEach(btn => {
            btn.bg.setFillStyle(0x2d5f3f);
            btn.buttonText.setColor('#ffffff');
        });
        
        // Highlight selected
        if (this.menuButtons[index]) {
            this.menuButtons[index].bg.setFillStyle(0x4a9f6f);
            this.menuButtons[index].buttonText.setColor('#ffff00');
        }
    }
    
    update() {
        // Keyboard navigation
        if (Phaser.Input.Keyboard.JustDown(this.cursors.up)) {
            this.selectedIndex = (this.selectedIndex - 1 + this.menuButtons.length) % this.menuButtons.length;
            this.highlightButton(this.selectedIndex);
            if (this.audioManager) {
                this.audioManager.playSFX('buttonClick');
            }
        } else if (Phaser.Input.Keyboard.JustDown(this.cursors.down)) {
            this.selectedIndex = (this.selectedIndex + 1) % this.menuButtons.length;
            this.highlightButton(this.selectedIndex);
            if (this.audioManager) {
                this.audioManager.playSFX('buttonClick');
            }
        }
        
        // Selection
        if (Phaser.Input.Keyboard.JustDown(this.enterKey) || Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
            const button = this.menuButtons[this.selectedIndex];
            if (button) {
                button.emit('pointerdown');
            }
        }
    }
    
    selectOption(item) {
        if (this.audioManager) {
            this.audioManager.playSFX('buttonClick');
        }
        
        if (item.action) {
            item.action();
        } else if (item.scene) {
            this.scene.start(item.scene);
        }
    }
    
    startSeason() {
        // Initialize game manager if not exists
        if (!this.game.gameManager) {
            const GameManager = require('../managers/GameManager.js').default;
            this.game.gameManager = new GameManager();
        }
        
        this.scene.start('TeamManagementScene');
    }
    
    startQuickPlay() {
        this.scene.start('GameScene', { mode: 'quickPlay' });
    }
    
    continue() {
        // Load saved game
        if (this.game.gameManager) {
            // In a real implementation, load from storage
            this.scene.start('TeamManagementScene');
        }
    }
    
    showAchievements() {
        // Show achievements overlay or new scene
        const achievements = this.game.gameManager?.achievements || {};
        
        // Create achievement popup
        this.createAchievementPopup(achievements);
    }
    
    createAchievementPopup(achievements) {
        const { width, height } = this.cameras.main;
        
        // Overlay
        const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.8).setOrigin(0);
        overlay.setInteractive();
        
        // Popup background
        const popupBg = this.add.rectangle(width / 2, height / 2, 500, 400, 0x1a4d2e);
        popupBg.setStrokeStyle(3, 0xffd700);
        
        // Title
        this.add.text(width / 2, height / 2 - 170, 'ACHIEVEMENTS', {
            fontSize: '28px',
            fontFamily: 'Arial Black',
            color: '#ffd700'
        }).setOrigin(0.5);
        
        // Achievement list
        const achievementList = [
            { key: 'firstTouchdown', name: 'First Blood', desc: 'Score your first touchdown' },
            { key: 'shutout', name: 'Shutout', desc: 'Win without allowing points' },
            { key: 'comeback', name: 'Comeback Kid', desc: 'Win after trailing by 14+' },
            { key: 'undefeatedSeason', name: 'Perfect Season', desc: 'Win all regular season games' },
            { key: 'championshipWin', name: 'Champion', desc: 'Win the championship' }
        ];
        
        let yPos = height / 2 - 120;
        achievementList.forEach(ach => {
            const unlocked = achievements[ach.key] || false;
            const color = unlocked ? '#00ff00' : '#666666';
            const icon = unlocked ? '✓' : '✗';
            
            this.add.text(width / 2 - 200, yPos, `${icon} ${ach.name}`, {
                fontSize: '16px',
                fontFamily: 'Arial',
                color: color
            });
            
            this.add.text(width / 2 - 180, yPos + 20, ach.desc, {
                fontSize: '12px',
                fontFamily: 'Arial',
                color: '#aaaaaa'
            });
            
            yPos += 60;
        });
        
        // Close button
        const closeBtn = this.createMenuButton(width / 2, height / 2 + 160, 'CLOSE', () => {
            overlay.destroy();
            popupBg.destroy();
            closeBtn.destroy();
            // Destroy all achievement texts (not shown in this simplified version)
        });
    }
    
    checkForSave() {
        // Check if save data exists
        // In real implementation, check storage
        return this.game.gameManager?.season?.currentWeek > 1;
    }
}