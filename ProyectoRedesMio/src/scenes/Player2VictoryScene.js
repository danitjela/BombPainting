import Phaser from 'phaser';

export class Player2VictoryScene extends Phaser.Scene {
    constructor() {
        super('Player2VictoryScene');
    }

    preload(){
        this.load.image('title', 'assets/letrasVictoria/letrasVictoriaGrises.png');
        this.load.image('background', 'assets/FondoInicio.png');
        this.load.image('back', 'assets/letrasVictoria/botonVolverGris.png');
        this.load.image('backHover', 'assets/letrasVictoria/botonVolverAbiertoGris.png');

        this.load.audio('menuMusic', 'assets/efectosDeSonido/musicaMenu.mp3');
        this.load.audio('button', 'assets/efectosDeSonido/boton.mp3');
        this.load.audio('buttonClick', 'assets/efectosDeSonido/botonClick.mp3');
    }

    create(){
        this.mainTheme = this.sound.add('menuMusic', { loop: true });
        this.mainTheme.play();

        this.wallpaper = this.add.image(512, 378,'background');
        this.wallpaper.setScale(2);
        this.add.image(512, 378,'title');

        const backButton = this.add.image(512, 520, 'back').setInteractive({ useHandCursor: true });
        backButton.setScale(1.5);
        backButton.on('pointerover', () => {
            backButton.setTexture('backHover');
            this.sound.play('button');
        })
        backButton.on('pointerout', () => {
            backButton.setTexture('back');
        })
        backButton.on('pointerdown', () => {
            this.sound.play('buttonClick', {volume:0.5});
            this.scene.start('MenuScene');
        })
    }
}