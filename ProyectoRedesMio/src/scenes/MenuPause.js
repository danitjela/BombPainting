import Phaser from 'phaser';
import { GameScene } from './GameScene';


export class MenuPause extends Phaser.Scene {
    constructor() {
        super('MenuPause');
    }

    preload(){
        this.load.image('background', 'assets/MenuPausa/ManchaPausa.png');
        this.load.image('title', 'assets/MenuPausa/letrasPausa.png');

        this.load.image('resumeBtn', 'assets/MenuPausa/botonContinuarSinPulsar.png');
        this.load.image('resumeBtnHover', 'assets/MenuPausa/botonContinuarPulsado.png');

        this.load.image('menuBtn', 'assets/MenuPausa/botonInicioSinPulsar.png');
        this.load.image('menuBtnHover', 'assets/MenuPausa/botonInicioPulsado.png');

        this.load.audio('menuMusic', 'assets/efectosDeSonido/musicaMenu.mp3');

        this.load.audio('button', 'assets/efectosDeSonido/boton.mp3');
        this.load.audio('buttonClick', 'assets/efectosDeSonido/botonClick.mp3');
    }

    create() {
        this.mainTheme = this.sound.add('menuMusic', { loop: true, volume: 0.4 });
        this.mainTheme.play();

        this.add.image(512, 378, 'background');
        this.add.image(512, 400, 'title');

        const resumeBtn = this.add.image(512, 400, 'resumeBtn').setInteractive({ useHandCursor: true });
        resumeBtn.on('pointerover', () => {
            resumeBtn.setTexture('resumeBtnHover');
            this.sound.play('button');
        })
        resumeBtn.on('pointerout', () => {
            resumeBtn.setTexture('resumeBtn');
        })
        resumeBtn.on('pointerdown', () => {
            console.log('Game Init');
            this.sound.play('buttonClick', {volume:0.5});
            this.mainTheme.stop();
            this.scene.stop();
            this.scene.resume('GameScene');
        })

        const menuBtn = this.add.image(512, 500, 'menuBtn').setInteractive({ useHandCursor: true });
        menuBtn.on('pointerover', () => {
            menuBtn.setTexture('menuBtnHover');
            this.sound.play('button');
        })
        menuBtn.on('pointerout', () => {
            menuBtn.setTexture('menuBtn');
        })
        menuBtn.on('pointerdown', () => {
            console.log('BACK To Menu');
            this.sound.play('buttonClick', {volume:0.5});
            this.scene.stop();
            this.scene.stop('GameScene');
            this.scene.start('MenuScene');
            this.mainTheme.play();
        })
    }
}
