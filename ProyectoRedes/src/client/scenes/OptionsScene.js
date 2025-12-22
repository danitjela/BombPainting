import Phaser from 'phaser';

export class OptionsScene extends Phaser.Scene {

    constructor() {
        super('OptionsScene');
    }

    preload(){
        this.load.image('backgroundOptions', 'assets/MenuPausa/ManchaPausa.png');

        this.load.image('returnMenuOptions', 'assets/menuCreditos/botonVolverSinPulsar.png');
        this.load.image('returnMenuOptionsHover', 'assets/menuCreditos/botonVolverPulsado.png');

        this.load.image('sonido', 'assets/menuAjustes/volumenTexto.png');
        
        this.load.image('sonidoOn', 'assets/menuAjustes/completoSiConNo.png');
        this.load.image('sonidoOff', 'assets/menuAjustes/completoNoConSi.png');

        this.load.audio('button', 'assets/efectosDeSonido/boton.mp3');
        this.load.audio('buttonClick', 'assets/efectosDeSonido/botonClick.mp3');
    }

    create(){
        this.add.image(512,378,'backgroundOptions');

        this.add.text(512, 150, 'Ajustes', {
            fontSize:'80px',
            fontFamily:'PixelFont',
            color:'#777171ff'
        }).setOrigin(0.5);

        this.add.image(400, 350, 'sonido');

        let soundEnabled = this.registry.get('soundEnabled');

        if (soundEnabled === undefined){ 
            soundEnabled = true; 
            this.registry.set('soundEnabled', true); 
        }

        const SonidoOnBtn = this.add.image(600, 350, 'sonidoOn').setInteractive({ useHandCursor: true });
        const SonidoOffBtn = this.add.image(600, 350, 'sonidoOff').setInteractive({ useHandCursor: true });

        if (soundEnabled){ 
            SonidoOnBtn.setVisible(true).setActive(true);
            SonidoOffBtn.setVisible(false).setActive(false);
        } else {
            SonidoOnBtn.setVisible(false).setActive(false);
            SonidoOffBtn.setVisible(true).setActive(true);
        }

        // APARIENCIA DEL BOTÓN VOLVER
        // HOVER: REPRODUCE SONIDO Y CAMBIA TEXTURA A ESTADO HOVER
        SonidoOnBtn.on('pointerover', () => {
            this.sound.play('button');           // REPRODUCE SONIDO HOVER
            SonidoOnBtn.setScale(1.2); // CAMBIA TEXTURA A HOVER
        });

        // OUT: RESTAURA TEXTURA NORMAL
        SonidoOnBtn.on('pointerout', () => {
            SonidoOnBtn.setScale(1.0);   // RESTAURA TEXTURA NORMAL
        });

        // CLICK: REPRODUCE SONIDO DE CLICK Y CAMBIA A LA ESCENA DE MENÚ
        SonidoOnBtn.on('pointerdown', () => {
            console.log('Disable Sound');                      // LOG PARA DEBUG
            this.sound.play('buttonClick', {volume:0.5});    // REPRODUCE SONIDO CLICK
            this.registry.set('soundEnabled', false);
            this.sound.mute = true;
            SonidoOnBtn.active = false;
            SonidoOnBtn.visible = false;
            SonidoOffBtn.active = true;
            SonidoOffBtn.visible = true;
        });

        // APARIENCIA DEL BOTÓN VOLVER
        // HOVER: REPRODUCE SONIDO Y CAMBIA TEXTURA A ESTADO HOVER
        SonidoOffBtn.on('pointerover', () => {
            this.sound.play('button');           // REPRODUCE SONIDO HOVER
            SonidoOffBtn.setScale(1.2); // CAMBIA TEXTURA A HOVER
        });

        // OUT: RESTAURA TEXTURA NORMAL
        SonidoOffBtn.on('pointerout', () => {
            SonidoOffBtn.setScale(1.0);   // RESTAURA TEXTURA NORMAL
        });

        // CLICK: REPRODUCE SONIDO DE CLICK Y CAMBIA A LA ESCENA DE MENÚ
        SonidoOffBtn.on('pointerdown', () => {
            console.log('Active Sound');                      // LOG PARA DEBUG
            this.sound.play('buttonClick', {volume:0.5});    // REPRODUCE SONIDO CLICK
            this.registry.set('soundEnabled', true);
            this.sound.mute = false;
            SonidoOffBtn.active = false;
            SonidoOffBtn.visible = false;
            SonidoOnBtn.active = true;
            SonidoOnBtn.visible = true;
        });


        const volverBtnOptions = this.add.image(300, 550, 'returnMenuOptions').setInteractive({ useHandCursor: true }).setScale(0.6);

        // APARIENCIA DEL BOTÓN VOLVER
        // HOVER: REPRODUCE SONIDO Y CAMBIA TEXTURA A ESTADO HOVER
        volverBtnOptions.on('pointerover', () => {
            this.sound.play('button');           // REPRODUCE SONIDO HOVER
            volverBtnOptions.setTexture('returnMenuOptionsHover').setScale(0.6); // CAMBIA TEXTURA A HOVER
        });

        // OUT: RESTAURA TEXTURA NORMAL
        volverBtnOptions.on('pointerout', () => {
            volverBtnOptions.setTexture('returnMenuOptions').setScale(0.6);   // RESTAURA TEXTURA NORMAL
        });

        // CLICK: REPRODUCE SONIDO DE CLICK Y CAMBIA A LA ESCENA DE MENÚ
        volverBtnOptions.on('pointerdown', () => {
            console.log('Return Menu');                      // LOG PARA DEBUG
            this.sound.play('buttonClick', {volume:0.5});    // REPRODUCE SONIDO CLICK
            this.scene.start('MenuScene');                   // CAMBIA A ESCENA MENU
        });
    }
}