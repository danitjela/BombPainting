import Phaser from 'phaser';
import { MenuScene } from './MenuScene';

export class Player1VictoryScene extends Phaser.Scene {
    constructor() {
        super('Player1VictoryScene');
    }

    preload(){
        this.load.image('title', 'assets/letrasVictoria/letrasVictoriaColor.png');
        this.load.image('background', 'assets/FondoInicioColor.png');
        this.load.image('back', 'assets/letrasVictoria/botonVolver.png');
        this.load.image('backHover', 'assets/letrasVictoria/botonVolverAbierto.png');

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