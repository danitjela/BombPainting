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
    }

    create() {

        this.add.image(512, 378, 'background');
        this.add.image(512, 400, 'title');

        const resumeBtn = this.add.image(512, 400, 'resumeBtn').setInteractive({ useHandCursor: true });
        resumeBtn.on('pointerover', () => {
            resumeBtn.setTexture('resumeBtnHover');
        })
        resumeBtn.on('pointerout', () => {
            resumeBtn.setTexture('resumeBtn');
        })
        resumeBtn.on('pointerdown', () => {
            console.log('Game Init');
            this.scene.stop();
            this.scene.resume('GameScene');
        })

        const menuBtn = this.add.image(512, 500, 'menuBtn').setInteractive({ useHandCursor: true });
        menuBtn.on('pointerover', () => {
            menuBtn.setTexture('menuBtnHover');
        })
        menuBtn.on('pointerout', () => {
            menuBtn.setTexture('menuBtn');
        })
        menuBtn.on('pointerdown', () => {
            console.log('BACK To Menu');
            this.scene.stop();
            this.scene.stop('GameScene');
            this.scene.start('MenuScene');
        })
    }
}
