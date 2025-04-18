export default class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    preload() {
        // Load minimal assets needed for loading screen
        this.load.image('loading-background', 'assets/images/backgrounds/loading-background.png');
        this.load.image('loading-bar', 'assets/images/backgrounds/loading-bar.png');
    }

    create() {
        this.scene.start('PreloadScene');
    }
}