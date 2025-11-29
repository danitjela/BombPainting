import Phaser from 'phaser';
import { MenuScene } from './MenuScene';


export class MenuCredits extends Phaser.Scene {
    constructor() {
        super('MenuCredits');
    }

    preload(){
        this.load.image('wallpaper', 'assets/fondoInicio.png')

        this.load.image('returnBtnHover', 'assets/menuCreditos/botonVolverPulsado.png');
        this.load.image('returnBtn', 'assets/menuCreditos/botonVolverSinPulsar.png');

        this.load.image('titleC', 'assets/menuCreditos/creditosLetras.png');
        this.load.image('participants', 'assets/menuCreditos/cuadroGente.png');

        this.load.audio('button', 'assets/efectosDeSonido/boton.mp3');
        this.load.audio('buttonClick', 'assets/efectosDeSonido/botonClick.mp3');

    }

    create() {
        const wallpaper = this.add.image(512, 384, 'wallpaper'); //Cargar imagen del fondo
        wallpaper.setScale(2.0);

        this.add.image(512, 100, 'titleC');

        this.add.image(512, 400, 'participants')

        const volverBtn = this.add.image(200, 700, 'returnBtn').setInteractive({ useHandCursor: true });
        volverBtn.on('pointerover', () => {
            this.sound.play('button');
            volverBtn.setTexture('returnBtnHover');
        })
        volverBtn.on('pointerout', () => {
            volverBtn.setTexture('returnBtn');
        })
        volverBtn.on('pointerdown', () => {
            console.log('Return Menu');
            this.sound.play('buttonClick', {volume:0.5});
            this.scene.start('MenuScene');
        })
    }
}