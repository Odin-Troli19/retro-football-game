export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        
        // Add player to scene and enable physics
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        // Player properties
        this.speed = 160;
        this.isRunning = false;
        this.hasBall = false;
        this.team = null; // 'offense' or 'defense'
        this.position = null; // 'QB', 'WR', etc.
        
        // Setup player animations
        this.setupAnimations();
    }
    
    setupAnimations() {
        // Create animations for the player sprite
        // These will be different based on player position and state
        
        // Idle animation
        if (!this.scene.anims.exists('player-idle')) {
            this.scene.anims.create({
                key: 'player-idle',
                frames: this.scene.anims.generateFrameNumbers('players', { start: 0, end: 3 }),
                frameRate: 8,
                repeat: -1
            });
        }
        
        // Running animation
        if (!this.scene.anims.exists('player-run')) {
            this.scene.anims.create({
                key: 'player-run',
                frames: this.scene.anims.generateFrameNumbers('players', { start: 4, end: 11 }),
                frameRate: 12,
                repeat: -1
            });
        }
    }
    
    run(direction) {
        this.isRunning = true;
        
        // Set velocity based on direction
        if (direction.x !== 0 || direction.y !== 0) {
            // Normalize the direction vector and multiply by speed
            const normalized = new Phaser.Math.Vector2(direction).normalize();
            this.setVelocity(
                normalized.x * this.speed,
                normalized.y * this.speed
            );
            
            // Play run animation
            this.anims.play('player-run', true);
            
            // Flip sprite based on horizontal direction
            if (direction.x < 0) {
                this.setFlipX(true);
            } else if (direction.x > 0) {
                this.setFlipX(false);
            }
        } else {
            // If no direction, stop moving and play idle animation
            this.stop();
        }
    }
    
    stop() {
        this.isRunning = false;
        this.setVelocity(0, 0);
        this.anims.play('player-idle', true);
    }
    
    receiveBall() {
        this.hasBall = true;
        // Additional logic when player receives the ball
    }
    
    throwBall(target) {
        if (this.hasBall) {
            this.hasBall = false;
            return true; // Successful throw
        }
        return false; // Can't throw without ball
    }
    
    tackle(player) {
        // Tackle logic
    }
    
    update() {
        // Update logic to be called from the scene's update method
    }
}