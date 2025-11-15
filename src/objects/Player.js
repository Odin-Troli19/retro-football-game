// src/objects/Player.js (Enhanced Version)
export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame, position = 'QB') {
        super(scene, x, y, texture, frame);
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        // Basic properties
        this.position = position;
        this.team = null; // 'offense' or 'defense'
        this.playerNumber = Math.floor(Math.random() * 99) + 1;
        
        // Ball handling
        this.hasBall = false;
        this.canCatch = false;
        
        // Movement
        this.baseSpeed = 160;
        this.currentSpeed = this.baseSpeed;
        this.sprintMultiplier = 1.5;
        this.isSprinting = false;
        this.isRunning = false;
        
        // Stamina system
        this.maxStamina = 100;
        this.stamina = this.maxStamina;
        this.staminaRecoveryRate = 0.5;
        this.staminaDrainRate = 0.3;
        
        // Stats (position-specific)
        this.stats = this.getPositionStats(position);
        
        // AI properties
        this.isAI = true;
        this.aiState = 'idle'; // idle, running, blocking, covering, tackling
        this.aiTarget = null;
        this.assignedRoute = null;
        this.assignedCoverage = null;
        
        // Animation state
        this.currentAnimation = 'idle';
        
        // Collision
        this.setCollideWorldBounds(true);
        
        // Setup
        this.setupAnimations();
        this.updateSpeedByPosition();
    }
    
    getPositionStats(position) {
        const baseStats = {
            speed: 70,
            strength: 70,
            agility: 70,
            awareness: 70,
            stamina: 70
        };
        
        switch(position) {
            case 'QB':
                return {
                    ...baseStats,
                    speed: 65,
                    throwPower: 85,
                    throwAccuracy: 82,
                    awareness: 88
                };
            case 'RB':
                return {
                    ...baseStats,
                    speed: 88,
                    agility: 85,
                    strength: 72,
                    carrying: 80
                };
            case 'WR':
                return {
                    ...baseStats,
                    speed: 92,
                    agility: 86,
                    catching: 85,
                    routeRunning: 82
                };
            case 'TE':
                return {
                    ...baseStats,
                    speed: 75,
                    strength: 82,
                    catching: 78,
                    blocking: 75
                };
            case 'OL':
                return {
                    ...baseStats,
                    speed: 55,
                    strength: 92,
                    blocking: 88,
                    awareness: 75
                };
            case 'DL':
                return {
                    ...baseStats,
                    speed: 70,
                    strength: 90,
                    tackling: 80,
                    passRush: 82
                };
            case 'LB':
                return {
                    ...baseStats,
                    speed: 78,
                    strength: 80,
                    tackling: 88,
                    coverage: 72
                };
            case 'DB':
                return {
                    ...baseStats,
                    speed: 90,
                    agility: 88,
                    coverage: 85,
                    tackling: 70
                };
            case 'K':
                return {
                    ...baseStats,
                    speed: 50,
                    kickPower: 88,
                    kickAccuracy: 85
                };
            default:
                return baseStats;
        }
    }
    
    updateSpeedByPosition() {
        // Adjust base speed based on stats
        this.baseSpeed = (this.stats.speed / 100) * 200;
        this.currentSpeed = this.baseSpeed;
    }
    
    setupAnimations() {
        const prefix = this.position.toLowerCase();
        
        // Create animations if they don't exist
        if (!this.scene.anims.exists(`${prefix}-idle`)) {
            this.scene.anims.create({
                key: `${prefix}-idle`,
                frames: this.scene.anims.generateFrameNumbers('players', { start: 0, end: 3 }),
                frameRate: 8,
                repeat: -1
            });
        }
        
        if (!this.scene.anims.exists(`${prefix}-run`)) {
            this.scene.anims.create({
                key: `${prefix}-run`,
                frames: this.scene.anims.generateFrameNumbers('players', { start: 4, end: 11 }),
                frameRate: 12,
                repeat: -1
            });
        }
        
        if (!this.scene.anims.exists(`${prefix}-throw`)) {
            this.scene.anims.create({
                key: `${prefix}-throw`,
                frames: this.scene.anims.generateFrameNumbers('players', { start: 12, end: 15 }),
                frameRate: 12,
                repeat: 0
            });
        }
        
        // Play idle by default
        this.anims.play(`${prefix}-idle`, true);
    }
    
    run(direction) {
        if (this.stamina <= 0) {
            this.isSprinting = false;
        }
        
        this.isRunning = true;
        
        // Calculate speed with sprint
        let speed = this.currentSpeed;
        if (this.isSprinting && this.stamina > 0) {
            speed *= this.sprintMultiplier;
            this.stamina -= this.staminaDrainRate;
        }
        
        if (direction.x !== 0 || direction.y !== 0) {
            const normalized = new Phaser.Math.Vector2(direction).normalize();
            this.setVelocity(normalized.x * speed, normalized.y * speed);
            
            // Play run animation
            const prefix = this.position.toLowerCase();
            this.anims.play(`${prefix}-run`, true);
            
            // Flip sprite
            if (direction.x < 0) {
                this.setFlipX(true);
            } else if (direction.x > 0) {
                this.setFlipX(false);
            }
        } else {
            this.stop();
        }
    }
    
    stop() {
        this.isRunning = false;
        this.setVelocity(0, 0);
        const prefix = this.position.toLowerCase();
        this.anims.play(`${prefix}-idle`, true);
    }
    
    sprint(enable) {
        this.isSprinting = enable && this.stamina > 20;
    }
    
    receiveBall() {
        this.hasBall = true;
        // Visual indicator could be added here
    }
    
    throwBall(target) {
        if (!this.hasBall) return false;
        
        // Play throw animation
        const prefix = this.position.toLowerCase();
        this.anims.play(`${prefix}-throw`, true);
        
        // Calculate throw accuracy based on stats
        const accuracy = this.stats.throwAccuracy || 70;
        const distance = Phaser.Math.Distance.Between(this.x, this.y, target.x, target.y);
        const power = this.stats.throwPower || 70;
        
        this.hasBall = false;
        
        return {
            accuracy: accuracy / 100,
            power: power / 100,
            distance: distance
        };
    }
    
    catchBall() {
        // Catching logic with stats
        const catchRating = this.stats.catching || 50;
        const catchChance = catchRating / 100;
        
        if (Math.random() < catchChance) {
            this.receiveBall();
            return true;
        }
        return false;
    }
    
    tackle(target) {
        if (!target || !target.hasBall) return false;
        
        const tackleRating = this.stats.tackling || 50;
        const distance = Phaser.Math.Distance.Between(this.x, this.y, target.x, target.y);
        
        if (distance < 30) {
            const tackleChance = tackleRating / 100;
            return Math.random() < tackleChance;
        }
        
        return false;
    }
    
    // Special moves
    juke(direction) {
        if (this.stamina < 10) return false;
        
        // Quick lateral movement
        const jukeSpeed = 200;
        this.setVelocity(direction.x * jukeSpeed, direction.y * jukeSpeed);
        this.stamina -= 10;
        
        return true;
    }
    
    spin() {
        if (this.stamina < 15) return false;
        
        // Spin move animation and physics
        this.stamina -= 15;
        
        return true;
    }
    
    stiffArm() {
        if (this.stamina < 12 || !this.hasBall) return false;
        
        this.stamina -= 12;
        
        return true;
    }
    
    // AI behavior
    updateAI(gameState) {
        if (!this.isAI) return;
        
        switch(this.aiState) {
            case 'running':
                this.aiRun(gameState);
                break;
            case 'blocking':
                this.aiBlock(gameState);
                break;
            case 'covering':
                this.aiCover(gameState);
                break;
            case 'tackling':
                this.aiTackle(gameState);
                break;
            default:
                this.aiIdle();
        }
    }
    
    aiRun(gameState) {
        if (this.assignedRoute) {
            // Follow route
            const target = this.assignedRoute.getNextPoint(this);
            if (target) {
                const direction = {
                    x: target.x - this.x,
                    y: target.y - this.y
                };
                this.run(direction);
            }
        }
    }
    
    aiBlock(gameState) {
        if (this.aiTarget) {
            // Move towards target to block
            const direction = {
                x: this.aiTarget.x - this.x,
                y: this.aiTarget.y - this.y
            };
            this.run(direction);
        }
    }
    
    aiCover(gameState) {
        if (this.assignedCoverage) {
            // Shadow the assigned receiver
            const direction = {
                x: this.assignedCoverage.x - this.x,
                y: this.assignedCoverage.y - this.y
            };
            this.run(direction);
        }
    }
    
    aiTackle(gameState) {
        if (this.aiTarget && this.aiTarget.hasBall) {
            // Pursue ball carrier
            const direction = {
                x: this.aiTarget.x - this.x,
                y: this.aiTarget.y - this.y
            };
            this.run(direction);
            
            // Attempt tackle if close
            if (this.tackle(this.aiTarget)) {
                // Tackle succeeded
                this.scene.events.emit('tackle', this, this.aiTarget);
            }
        }
    }
    
    aiIdle() {
        this.stop();
    }
    
    update(delta) {
        // Recover stamina when not sprinting
        if (!this.isSprinting && this.stamina < this.maxStamina) {
            this.stamina += this.staminaRecoveryRate;
            this.stamina = Math.min(this.stamina, this.maxStamina);
        }
        
        // Update AI
        if (this.isAI) {
            this.updateAI();
        }
    }
}