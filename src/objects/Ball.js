// src/objects/Ball.js
export default class Ball extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture || 'ball');
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        // Ball state
        this.inFlight = false;
        this.carrier = null;
        this.thrower = null;
        this.target = null;
        this.isLoose = false;
        this.lastCarrier = null;
        
        // Flight properties
        this.flightPath = null;
        this.flightProgress = 0;
        this.flightDuration = 0;
        this.spiralRotation = 0;
        this.apexHeight = 0;
        
        // Physics
        this.setCollideWorldBounds(true);
        this.setBounce(0.5, 0.5);
        this.setDrag(50);
        
        // Setup animations
        this.setupAnimations();
    }
    
    setupAnimations() {
        if (!this.scene.anims.exists('ball-spin')) {
            this.scene.anims.create({
                key: 'ball-spin',
                frames: this.scene.anims.generateFrameNumbers('ball', { start: 0, end: 3 }),
                frameRate: 16,
                repeat: -1
            });
        }
        
        if (!this.scene.anims.exists('ball-idle')) {
            this.scene.anims.create({
                key: 'ball-idle',
                frames: [{ key: 'ball', frame: 0 }],
                frameRate: 1,
                repeat: 0
            });
        }
    }
    
    // Attach ball to player
    attachToCarrier(player) {
        this.carrier = player;
        this.lastCarrier = player;
        this.inFlight = false;
        this.isLoose = false;
        this.target = null;
        
        // Stop physics
        this.setVelocity(0, 0);
        this.body.setAllowGravity(false);
        
        // Play idle animation
        this.anims.play('ball-idle', true);
        
        // Update player state
        if (player.receiveBall) {
            player.receiveBall();
        }
    }
    
    // Throw ball to target
    throwTo(thrower, target, power = 1.0, arc = 1.0) {
        this.thrower = thrower;
        this.target = target;
        this.carrier = null;
        this.inFlight = true;
        this.flightProgress = 0;
        
        // Calculate flight path
        const startPos = { x: thrower.x, y: thrower.y };
        const endPos = { x: target.x, y: target.y };
        const distance = Phaser.Math.Distance.Between(startPos.x, startPos.y, endPos.x, endPos.y);
        
        // Flight duration based on distance and power
        this.flightDuration = (distance / (200 * power)) * 1000; // milliseconds
        
        // Calculate apex height based on distance and arc
        this.apexHeight = (distance / 3) * arc;
        
        // Store flight path
        this.flightPath = {
            start: startPos,
            end: endPos,
            startTime: Date.now()
        };
        
        // Play spiral animation
        this.anims.play('ball-spin', true);
        
        // Call thrower's throw animation
        if (thrower.throwBall) {
            thrower.throwBall(target);
        }
        
        // Play pass sound
        if (this.scene.audioManager) {
            this.scene.audioManager.playSFX('pass');
        }
    }
    
    // Kick ball (for kickoffs, punts, field goals)
    kick(kicker, angle, power, isFieldGoal = false) {
        this.carrier = null;
        this.inFlight = true;
        this.flightProgress = 0;
        
        // Calculate velocity from angle and power
        const velocityX = Math.cos(angle) * power * 300;
        const velocityY = Math.sin(angle) * power * -300;
        
        this.setVelocity(velocityX, velocityY);
        this.body.setAllowGravity(true);
        
        // Add spin
        this.anims.play('ball-spin', true);
        
        // If field goal, check if it goes through uprights
        if (isFieldGoal) {
            this.checkFieldGoal = true;
        }
    }
    
    // Make ball loose (fumble)
    fumble(force = { x: 0, y: 0 }) {
        this.carrier = null;
        this.inFlight = false;
        this.isLoose = true;
        
        // Apply random force
        const randomX = (Math.random() - 0.5) * 200 + force.x;
        const randomY = (Math.random() - 0.5) * 200 + force.y;
        
        this.setVelocity(randomX, randomY);
        this.body.setAllowGravity(false);
        
        // Play spin
        this.anims.play('ball-spin', true);
        
        // Play fumble sound
        if (this.scene.audioManager) {
            this.scene.audioManager.playSFX('fumble');
        }
    }
    
    // Update ball position during flight
    updateFlight() {
        if (!this.inFlight || !this.flightPath) {
            return;
        }
        
        const elapsed = Date.now() - this.flightPath.startTime;
        this.flightProgress = Math.min(elapsed / this.flightDuration, 1);
        
        // Interpolate position
        const x = Phaser.Math.Linear(
            this.flightPath.start.x,
            this.flightPath.end.x,
            this.flightProgress
        );
        
        const y = Phaser.Math.Linear(
            this.flightPath.start.y,
            this.flightPath.end.y,
            this.flightProgress
        );
        
        // Add parabolic arc
        const arcProgress = Math.sin(this.flightProgress * Math.PI);
        const arcY = y - (arcProgress * this.apexHeight);
        
        // Update position
        this.setPosition(x, arcY);
        
        // Update rotation for spiral effect
        this.spiralRotation += 0.3;
        this.setRotation(this.spiralRotation);
        
        // Check if flight is complete
        if (this.flightProgress >= 1) {
            this.completeFlight();
        }
    }
    
    // Complete the flight (catch or incomplete)
    completeFlight() {
        this.inFlight = false;
        this.setRotation(0);
        
        // Check if target caught the ball
        if (this.target && Phaser.Math.Distance.Between(this.x, this.y, this.target.x, this.target.y) < 30) {
            // Successful catch
            this.attachToCarrier(this.target);
            
            if (this.scene.audioManager) {
                this.scene.audioManager.playSFX('catch');
            }
            
            // Call target's catch method
            if (this.target.catchBall) {
                this.target.catchBall();
            }
        } else {
            // Incomplete pass - ball hits ground
            this.makeLoose();
        }
        
        this.flightPath = null;
    }
    
    // Ball hits ground
    makeLoose() {
        this.isLoose = true;
        this.setVelocity(0, 0);
        this.anims.play('ball-idle', true);
    }
    
    // Pick up loose ball
    pickUp(player) {
        if (this.isLoose || !this.carrier) {
            this.attachToCarrier(player);
            return true;
        }
        return false;
    }
    
    // Update method called every frame
    update() {
        // Update flight
        if (this.inFlight) {
            this.updateFlight();
        }
        
        // Follow carrier if attached
        if (this.carrier) {
            const offsetX = this.carrier.flipX ? -10 : 10;
            this.setPosition(this.carrier.x + offsetX, this.carrier.y);
        }
        
        // Slow down loose ball
        if (this.isLoose) {
            this.setVelocity(
                this.body.velocity.x * 0.95,
                this.body.velocity.y * 0.95
            );
            
            // Stop when slow enough
            if (Math.abs(this.body.velocity.x) < 5 && Math.abs(this.body.velocity.y) < 5) {
                this.setVelocity(0, 0);
            }
        }
    }
    
    // Reset ball to position
    reset(x, y) {
        this.setPosition(x, y);
        this.setVelocity(0, 0);
        this.carrier = null;
        this.inFlight = false;
        this.isLoose = false;
        this.target = null;
        this.setRotation(0);
        this.anims.play('ball-idle', true);
    }
}