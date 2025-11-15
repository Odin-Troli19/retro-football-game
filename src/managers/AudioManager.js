// src/managers/AudioManager.js
export default class AudioManager {
    constructor(scene) {
        this.scene = scene;
        this.sounds = {};
        this.music = null;
        this.musicVolume = 0.5;
        this.sfxVolume = 0.7;
        this.muted = false;
    }
    
    // Load all audio assets
    preload(scene) {
        // Music tracks
        scene.load.audio('menu-music', 'assets/audio/music/menu.mp3');
        scene.load.audio('game-music', 'assets/audio/music/game.mp3');
        scene.load.audio('victory-music', 'assets/audio/music/victory.mp3');
        
        // Sound effects
        scene.load.audio('whistle', 'assets/audio/sfx/whistle.mp3');
        scene.load.audio('tackle', 'assets/audio/sfx/tackle.mp3');
        scene.load.audio('pass', 'assets/audio/sfx/pass.mp3');
        scene.load.audio('catch', 'assets/audio/sfx/catch.mp3');
        scene.load.audio('touchdown', 'assets/audio/sfx/touchdown.mp3');
        scene.load.audio('field-goal', 'assets/audio/sfx/field-goal.mp3');
        scene.load.audio('crowd-cheer', 'assets/audio/sfx/crowd-cheer.mp3');
        scene.load.audio('crowd-boo', 'assets/audio/sfx/crowd-boo.mp3');
        scene.load.audio('crowd-ambient', 'assets/audio/sfx/crowd-ambient.mp3');
        scene.load.audio('button-click', 'assets/audio/sfx/button-click.mp3');
        scene.load.audio('fumble', 'assets/audio/sfx/fumble.mp3');
        scene.load.audio('interception', 'assets/audio/sfx/interception.mp3');
        scene.load.audio('sack', 'assets/audio/sfx/sack.mp3');
    }
    
    // Initialize sounds
    create() {
        // Create sound objects
        this.sounds.whistle = this.scene.sound.add('whistle', { volume: this.sfxVolume });
        this.sounds.tackle = this.scene.sound.add('tackle', { volume: this.sfxVolume });
        this.sounds.pass = this.scene.sound.add('pass', { volume: this.sfxVolume * 0.8 });
        this.sounds.catch = this.scene.sound.add('catch', { volume: this.sfxVolume });
        this.sounds.touchdown = this.scene.sound.add('touchdown', { volume: this.sfxVolume });
        this.sounds.fieldGoal = this.scene.sound.add('field-goal', { volume: this.sfxVolume });
        this.sounds.crowdCheer = this.scene.sound.add('crowd-cheer', { volume: this.sfxVolume * 0.6 });
        this.sounds.crowdBoo = this.scene.sound.add('crowd-boo', { volume: this.sfxVolume * 0.6 });
        this.sounds.crowdAmbient = this.scene.sound.add('crowd-ambient', { 
            volume: this.sfxVolume * 0.3, 
            loop: true 
        });
        this.sounds.buttonClick = this.scene.sound.add('button-click', { volume: this.sfxVolume * 0.5 });
        this.sounds.fumble = this.scene.sound.add('fumble', { volume: this.sfxVolume });
        this.sounds.interception = this.scene.sound.add('interception', { volume: this.sfxVolume });
        this.sounds.sack = this.scene.sound.add('sack', { volume: this.sfxVolume });
        
        // Start ambient crowd noise
        if (!this.muted) {
            this.sounds.crowdAmbient.play();
        }
    }
    
    // Play music
    playMusic(key) {
        // Stop current music if playing
        if (this.music && this.music.isPlaying) {
            this.music.stop();
        }
        
        // Create and play new music
        this.music = this.scene.sound.add(key, {
            volume: this.musicVolume,
            loop: true
        });
        
        if (!this.muted) {
            this.music.play();
        }
    }
    
    // Stop music
    stopMusic() {
        if (this.music && this.music.isPlaying) {
            this.music.stop();
        }
    }
    
    // Play sound effect
    playSFX(key) {
        if (!this.muted && this.sounds[key]) {
            this.sounds[key].play();
        }
    }
    
    // Play with random pitch variation for variety
    playSFXWithVariation(key, pitchVariation = 0.2) {
        if (!this.muted && this.sounds[key]) {
            const pitch = 1 + (Math.random() * pitchVariation * 2 - pitchVariation);
            this.sounds[key].play({ detune: (pitch - 1) * 1200 });
        }
    }
    
    // Set master volume
    setMasterVolume(volume) {
        this.scene.sound.volume = volume;
    }
    
    // Set music volume
    setMusicVolume(volume) {
        this.musicVolume = volume;
        if (this.music) {
            this.music.setVolume(volume);
        }
    }
    
    // Set SFX volume
    setSFXVolume(volume) {
        this.sfxVolume = volume;
        Object.values(this.sounds).forEach(sound => {
            if (sound !== this.sounds.crowdAmbient) {
                sound.setVolume(volume);
            } else {
                sound.setVolume(volume * 0.3);
            }
        });
    }
    
    // Toggle mute
    toggleMute() {
        this.muted = !this.muted;
        this.scene.sound.mute = this.muted;
        
        if (this.muted) {
            this.sounds.crowdAmbient.pause();
        } else {
            this.sounds.crowdAmbient.resume();
        }
        
        return this.muted;
    }
    
    // Context-specific sounds
    playTackleSound() {
        this.playSFXWithVariation('tackle', 0.3);
    }
    
    playTouchdownSequence() {
        this.playSFX('touchdown');
        setTimeout(() => this.playSFX('crowdCheer'), 200);
    }
    
    playFieldGoalSequence() {
        this.playSFX('fieldGoal');
        setTimeout(() => this.playSFX('crowdCheer'), 500);
    }
    
    playInterceptionSound() {
        this.playSFX('interception');
        setTimeout(() => this.playSFX('crowdBoo'), 300);
    }
    
    playSackSound() {
        this.playSFX('sack');
        this.playSFXWithVariation('tackle', 0.2);
    }
    
    // Update crowd ambient based on game state
    updateCrowdIntensity(intensity) {
        if (this.sounds.crowdAmbient) {
            const volume = Math.min(1, this.sfxVolume * 0.3 * (1 + intensity));
            this.sounds.crowdAmbient.setVolume(volume);
        }
    }
    
    // Clean up
    destroy() {
        this.stopMusic();
        Object.values(this.sounds).forEach(sound => {
            if (sound.isPlaying) {
                sound.stop();
            }
        });
    }
}