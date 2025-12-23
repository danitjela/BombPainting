import Phaser from 'phaser';

export class OptionsScene extends Phaser.Scene {

    constructor() {
        super('OptionsScene');
    }

    preload(){
        //CARGA DE ASSETS NECESARIOS
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
        //AÑADE IMAGEN DE FONDO
        this.add.image(512,378,'backgroundOptions');

        //AÑADE TÍTULO DE AJUSTES
        this.add.text(512, 150, 'Ajustes', {
            fontSize:'80px',
            fontFamily:'PixelFont',
            color:'#777171ff'
        }).setOrigin(0.5);

        //AÑADE IMAGEN DE ASSET
        this.add.image(400, 350, 'sonido');

        //VARIABLE PARA VER SI EL SONIDO ESTÁ ENCENDIDO O APAGADO, 
        //NECESARIO PARA VERIFICAR EL ESTADO AL HACER EL CREATE
        let soundEnabled = this.registry.get('soundEnabled');

        //LA PRIMERA VEZ, SE PONE A TRUE, POR DEFECTO
        if (soundEnabled === undefined){ 
            soundEnabled = true; 
            this.registry.set('soundEnabled', true); 
        }

        //BOTONES
        const SonidoOnBtn = this.add.image(600, 350, 'sonidoOn').setInteractive({ useHandCursor: true });
        const SonidoOffBtn = this.add.image(600, 350, 'sonidoOff').setInteractive({ useHandCursor: true });

        //SI EL SONIDO ESTÁ ACTIVO APARECE UN BOTÓN, SI NO, APARECE EL OTRO
        if (soundEnabled){ 
            SonidoOnBtn.setVisible(true).setActive(true);
            SonidoOffBtn.setVisible(false).setActive(false);
        } else {
            SonidoOnBtn.setVisible(false).setActive(false);
            SonidoOffBtn.setVisible(true).setActive(true);
        }

        // APARIENCIA DEL BOTÓN VOLVER
        // HOVER: REPRODUCE SONIDO Y CAMBIA ESCALA
        SonidoOnBtn.on('pointerover', () => {
            this.sound.play('button'); // REPRODUCE SONIDO HOVER
            SonidoOnBtn.setScale(1.2); // CAMBIA ESCALA
        });

        SonidoOnBtn.on('pointerout', () => {
            SonidoOnBtn.setScale(1.0); // RESTAURA ESCALA NORMAL
        });

        // CLICK: REPRODUCE SONIDO DE CLICK Y CAMBIA EL VALOR DEL SONIDO
        SonidoOnBtn.on('pointerdown', () => {
            console.log('Disable Sound'); // LOG PARA DEBUG
            this.sound.play('buttonClick', {volume:0.5}); // REPRODUCE SONIDO CLICK
            this.registry.set('soundEnabled', false); //CAMBIA EL SONIDO A OFF
            this.sound.mute = true; //VARIABLE QUE CONTROLA EL SONIDO EN PHASER
            //LOGICA PARA APARIENCIA DE LOS BOTONES
            SonidoOnBtn.active = false;
            SonidoOnBtn.visible = false;
            SonidoOffBtn.active = true;
            SonidoOffBtn.visible = true;
        });

        SonidoOffBtn.on('pointerover', () => {
            this.sound.play('button'); // REPRODUCE SONIDO HOVER
            SonidoOffBtn.setScale(1.2); // CAMBIA ESCALA
        });

        // OUT: RESTAURA ESCALA NORMAL
        SonidoOffBtn.on('pointerout', () => {
            SonidoOffBtn.setScale(1.0); // RESTAURA ESCALA NORMAL
        });

        // CLICK: REPRODUCE SONIDO DE CLICK Y CAMBIA EL VALOR DEL SONIDO
        SonidoOffBtn.on('pointerdown', () => {
            console.log('Active Sound'); // LOG PARA DEBUG
            this.sound.play('buttonClick', {volume:0.5}); // REPRODUCE SONIDO CLICK
            this.registry.set('soundEnabled', true); // HABILITA EL SONIDO
            this.sound.mute = false; // HABILITA EL SONIDO EN LA VARIABLE DE PHASER
            //LOGICA PARA LA APARIENCIA DE LOS BOTONES
            SonidoOffBtn.active = false;
            SonidoOffBtn.visible = false;
            SonidoOnBtn.active = true;
            SonidoOnBtn.visible = true;
        });


        //BOTÓN DE VOLVER AL MENÚ
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