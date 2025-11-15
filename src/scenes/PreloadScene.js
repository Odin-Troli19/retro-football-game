// src/scenes/PreloadScene.js
export default class PreloadScene extends Phaser.Scene {
    constructor() {
        super('PreloadScene');
    }
    
    preload() {
        const { width, height } = this.cameras.main;
        
        // Background
        this.add.rectangle(0, 0, width, height, 0x1a4d2e).setOrigin(0);
        
        // Loading text
        const loadingText = this.add.text(width / 2, height / 2 - 50, 'LOADING...', {
            fontSize: '32px',
            fontFamily: 'Arial Black',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        // Progress bar background
        const progressBarBg = this.add.rectangle(width / 2, height / 2, 400, 30, 0x222222);
        progressBarBg.setStrokeStyle(2, 0x4a7c59);
        
        // Progress bar fill
        const progressBar = this.add.rectangle(width / 2 - 200, height / 2, 0, 26, 0x4a9f6f);
        progressBar.setOrigin(0, 0.5);
        
        // Percentage text
        const percentText = this.add.text(width / 2, height / 2 + 40, '0%', {
            fontSize: '18px',
            fontFamily: 'Arial',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        // Asset loading text
        const assetText = this.add.text(width / 2, height / 2 + 70, '', {
            fontSize: '14px',
            fontFamily: 'Arial',
            color: '#aaaaaa'
        }).setOrigin(0.5);
        
        // Update progress bar
        this.load.on('progress', (value) => {
            progressBar.width = 400 * value;
            percentText.setText(Math.floor(value * 100) + '%');
        });
        
        // Update loading text
        this.load.on('fileprogress', (file) => {
            assetText.setText('Loading: ' + file.key);
        });
        
        // Complete
        this.load.on('complete', () => {
            loadingText.setText('READY!');
            assetText.setText('Press SPACE to start');
        });
        
        // Load all game assets
        this.loadAssets();
    }
    
    loadAssets() {
        // === IMAGES ===
        
        // Backgrounds
        this.load.image('menu-bg', 'assets/images/backgrounds/menu-bg.png');
        this.load.image('field', 'assets/images/backgrounds/field.png');
        this.load.image('field-overlay', 'assets/images/backgrounds/field-overlay.png');
        
        // Sprites (using sprite atlases for better performance)
        this.load.spritesheet('players', 'assets/images/sprites/players.png', {
            frameWidth: 32,
            frameHeight: 32
        });
        
        this.load.spritesheet('ball', 'assets/images/sprites/ball.png', {
            frameWidth: 16,
            frameHeight: 16
        });
        
        // UI Elements
        this.load.image('button', 'assets/images/ui/button.png');
        this.load.image('button-hover', 'assets/images/ui/button-hover.png');
        this.load.image('panel', 'assets/images/ui/panel.png');
        this.load.image('scoreboard', 'assets/images/ui/scoreboard.png');
        
        // Icons
        this.load.image('icon-trophy', 'assets/images/ui/icons/trophy.png');
        this.load.image('icon-star', 'assets/images/ui/icons/star.png');
        this.load.image('icon-settings', 'assets/images/ui/icons/settings.png');
        
        // === AUDIO ===
        
        // Music
        this.load.audio('menu-music', 'assets/audio/music/menu.mp3');
        this.load.audio('game-music', 'assets/audio/music/game.mp3');
        this.load.audio('victory-music', 'assets/audio/music/victory.mp3');
        this.load.audio('defeat-music', 'assets/audio/music/defeat.mp3');
        
        // Sound Effects
        this.load.audio('whistle', 'assets/audio/sfx/whistle.mp3');
        this.load.audio('tackle', 'assets/audio/sfx/tackle.mp3');
        this.load.audio('pass', 'assets/audio/sfx/pass.mp3');
        this.load.audio('catch', 'assets/audio/sfx/catch.mp3');
        this.load.audio('touchdown', 'assets/audio/sfx/touchdown.mp3');
        this.load.audio('field-goal', 'assets/audio/sfx/field-goal.mp3');
        this.load.audio('crowd-cheer', 'assets/audio/sfx/crowd-cheer.mp3');
        this.load.audio('crowd-boo', 'assets/audio/sfx/crowd-boo.mp3');
        this.load.audio('crowd-ambient', 'assets/audio/sfx/crowd-ambient.mp3');
        this.load.audio('button-click', 'assets/audio/sfx/button-click.mp3');
        this.load.audio('fumble', 'assets/audio/sfx/fumble.mp3');
        this.load.audio('interception', 'assets/audio/sfx/interception.mp3');
        this.load.audio('sack', 'assets/audio/sfx/sack.mp3');
        
        // === FONTS ===
        // If using custom pixel fonts, load them here
        // this.load.bitmapFont('pixel-font', 'assets/fonts/pixel-font.png', 'assets/fonts/pixel-font.xml');
    }
    
    create() {
        // Wait for space key or click to continue
        this.input.keyboard.once('keydown-SPACE', () => {
            this.startGame();
        });
        
        this.input.once('pointerdown', () => {
            this.startGame();
        });
    }
    
    startGame() {
        // Initialize audio manager
        const AudioManager = require('../managers/AudioManager.js').default;
        this.game.audioManager = new AudioManager(this);
        this.game.audioManager.create();
        
        // Initialize game manager
        const GameManager = require('../managers/GameManager.js').default;
        if (!this.game.gameManager) {
            this.game.gameManager = new GameManager();
        }
        
        // Start menu scene
        this.scene.start('MenuScene');
    }
}