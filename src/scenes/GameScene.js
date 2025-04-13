import Player from '../objects/Player.js';
import Ball from '../objects/Ball.js';
import Field from '../objects/Field.js';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    init(data) {
        // Initialize game state
        this.gameState = 'kickoff'; // Other states: 'play', 'huddle', etc.
        this.currentDown = 1;
        this.yardsToGo = 10;
        this.timeRemaining = 900; // 15 minutes in seconds
        this.quarter = 1;
        this.score = {
            player: 0,
            cpu: 0
        };
    }

    create() {
        // Create the field
        this.field = new Field(this, 0, 0, 'field');
        
        // Create teams
        this.createTeams();
        
        // Create ball
        this.ball = new Ball(this, 400, 240, 'ball');
        
        // Setup input
        this.cursors = this.input.keyboard.createCursorKeys();
        this.keys = this.input.keyboard.addKeys({
            throw: Phaser.Input.Keyboard.KeyCodes.SPACE,
            tackle: Phaser.Input.Keyboard.KeyCodes.Z
        });
        
        // Setup camera
        this.cameras.main.startFollow(this.activePlayer, true);
        this.cameras.main.setZoom(1.5);
        
        // Set initial game state
        this.setKickoffFormation();
        
        // Create UI scene on top
        this.scene.launch('UIScene', { gameScene: this });
    }
    
    createTeams() {
        // Create player team
        this.playerTeam = this.physics.add.group();
        
        // Create player-controlled character
        this.playerQB = new Player(this, 400, 300, 'players', 0);
        this.playerQB.team = 'offense';
        this.playerQB.position = 'QB';
        this.playerTeam.add(this.playerQB);
        
        // Add more players...
        
        // Create CPU team
        this.cpuTeam = this.physics.add.group();
        
        // Add CPU players...
        
        // Set active player (the one controlled by the user)
        this.activePlayer = this.playerQB;
        
        // Setup collisions
        this.physics.add.collider(this.playerTeam, this.cpuTeam, this.handlePlayerCollision, null, this);
    }
    
    setKickoffFormation() {
        // Position players for kickoff
        // This would position all players in appropriate kickoff spots
    }
    
    handlePlayerCollision(player1, player2) {
        // Handle collisions between players (tackles, blocks, etc.)
    }
    
    handleUserInput() {
        // Create a direction vector based on cursor input
        const direction = new Phaser.Math.Vector2(0, 0);
        
        if (this.cursors.left.isDown) {
            direction.x = -1;
        } else if (this.cursors.right.isDown) {
            direction.x = 1;
        }
        
        if (this.cursors.up.isDown) {
            direction.y = -1;
        } else if (this.cursors.down.isDown) {
            direction.y = 1;
        }
        
        // Make the active player run in the given direction
        this.activePlayer.run(direction);
        
        // Handle throw input
        if (Phaser.Input.Keyboard.JustDown(this.keys.throw)) {
            // Logic for selecting a receiver and throwing the ball
            if (this.activePlayer.hasBall) {
                this.handleThrow();
            }
        }
    }
    
    handleThrow() {
        // Throwing logic here
    }
    
    updateGameState() {
        // Update time, score, field position, etc.
    }
    
    update() {
        // Handle user input
        this.handleUserInput();
        
        // Update all player AI for non-controlled players
        
        // Update game state
        this.updateGameState();
    }
}