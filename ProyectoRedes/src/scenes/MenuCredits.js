// IMPORTA PHASER Y ESCENA MENU 
import Phaser from 'phaser';
import { MenuScene } from './MenuScene';

// FUNCIÓN QUE SIRVE PARA MOSTRAR LOS CRÉDITOS Y UN BOTÓN DE VOLVER
export class MenuCredits extends Phaser.Scene {
    // FUNCIÓN QUE SIRVE PARA INICIALIZAR LA ESCENA 
    constructor() {
        // LLAMA A CONSTRUCTOR PADRE Y ASIGNA KEY
        super('MenuCredits');
    }

    // FUNCIÓN QUE SIRVE PARA CARGAR RECURSOS (IMÁGENES Y SONIDOS)
    preload(){
        // CARGA FONDO
        this.load.image('wallpaper', 'assets/fondoInicio.png');

        // CARGA BOTÓN VOLVER (ESTADOS NORMAL Y HOVER)
        this.load.image('returnBtnHover', 'assets/menuCreditos/botonVolverPulsado.png');
        this.load.image('returnBtn', 'assets/menuCreditos/botonVolverSinPulsar.png');

        // CARGA TÍTULO Y CUADRO DE PARTICIPANTES
        this.load.image('titleC', 'assets/menuCreditos/creditosLetras.png');
        this.load.image('participants', 'assets/menuCreditos/cuadroGente.png');

        // CARGA EFECTOS DE SONIDO DE BOTÓN
        this.load.audio('button', 'assets/efectosDeSonido/boton.mp3');
        this.load.audio('buttonClick', 'assets/efectosDeSonido/botonClick.mp3');
    }

    // FUNCIÓN QUE SIRVE PARA CREAR LA INTERFAZ DE CRÉDITOS Y CONFIGURAR EL BOTÓN DE VOLVER
    create() {
        // AÑADE IMAGEN DE FONDO Y LA ESCALA
        const wallpaper = this.add.image(512, 384, 'wallpaper');
        wallpaper.setScale(2.0); // AJUSTA ESCALA DEL FONDO

        // AÑADE TÍTULO DE CRÉDITOS
        this.add.image(512, 100, 'titleC');

        // AÑADE CUADRO CON PARTICIPANTES
        this.add.image(512, 400, 'participants');

        // CREA BOTÓN DE VOLVER 
        const volverBtn = this.add.image(200, 700, 'returnBtn').setInteractive({ useHandCursor: true });

        // APARIENCIA DEL BOTÓN VOLVER
        // HOVER: REPRODUCE SONIDO Y CAMBIA TEXTURA A ESTADO HOVER
        volverBtn.on('pointerover', () => {
            this.sound.play('button');           // REPRODUCE SONIDO HOVER
            volverBtn.setTexture('returnBtnHover'); // CAMBIA TEXTURA A HOVER
        });

        // OUT: RESTAURA TEXTURA NORMAL
        volverBtn.on('pointerout', () => {
            volverBtn.setTexture('returnBtn');   // RESTAURA TEXTURA NORMAL
        });

        // CLICK: REPRODUCE SONIDO DE CLICK Y CAMBIA A LA ESCENA DE MENÚ
        volverBtn.on('pointerdown', () => {
            console.log('Return Menu');                      // LOG PARA DEBUG
            this.sound.play('buttonClick', {volume:0.5});    // REPRODUCE SONIDO CLICK
            this.scene.start('MenuScene');                   // CAMBIA A ESCENA MENU
        });
    }
}