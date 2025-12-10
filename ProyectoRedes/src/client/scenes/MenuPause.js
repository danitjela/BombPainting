// MÓDULOS: IMPORTA PHASER Y LA ESCENA PRINCIPAL DEL JUEGO
import Phaser from 'phaser';
import { GameScene } from './GameScene';

// CLASE QUE SIRVE PARA GESTIONAR EL MENÚ DE PAUSA
export class MenuPause extends Phaser.Scene {
    // FUNCIÓN QUE SIRVE PARA CONSTRUIR LA ESCENA DE PAUSA
    constructor() {
        super('MenuPause'); // CREA NOMBRE DE LA ESCENA
    }

    // FUNCIÓN QUE SIRVE PARA CARGAR RECURSOS NECESARIOS (IMÁGENES Y SONIDOS)
    preload(){
        // CARGA IMAGEN DE FONDO DEL MENÚ DE PAUSA
        this.load.image('backgroundp', 'assets/MenuPausa/ManchaPausa.png');
        // CARGA IMAGEN DEL TÍTULO DEL MENÚ
        this.load.image('titlep', 'assets/MenuPausa/letrasPausa.png');

        // CARGA IMAGEN BOTÓN REANUDAR (NORMAL)
        this.load.image('resumeBtn', 'assets/MenuPausa/botonContinuarSinPulsar.png');
        // CARGA IMAGEN BOTÓN REANUDAR (HOVER)
        this.load.image('resumeBtnHover', 'assets/MenuPausa/botonContinuarPulsado.png');

        // CARGA IMAGEN BOTÓN VOLVER AL MENÚ (NORMAL)
        this.load.image('menuBtn', 'assets/MenuPausa/botonInicioSinPulsar.png');
        // CARGA IMAGEN BOTÓN VOLVER AL MENÚ (HOVER)
        this.load.image('menuBtnHover', 'assets/MenuPausa/botonInicioPulsado.png');

        // CARGA MÚSICA PRINCIPAL DEL MENÚ
        this.load.audio('menuMusic', 'assets/efectosDeSonido/musicaMenu.mp3');

        // CARGA EFECTOS DE SONIDO PARA INTERACCIÓN CON BOTONES
        this.load.audio('button', 'assets/efectosDeSonido/boton.mp3');
        this.load.audio('buttonClick', 'assets/efectosDeSonido/botonClick.mp3');
    }

    // FUNCIÓN QUE SIRVE PARA CREAR LOS ELEMENTOS EN PANTALLA Y ASIGNAR INTERACCIONES
    create() {
        // CREA AUDIO PRINCIPAL, CONFIGURA BUCLE Y VOLUMEN
        this.mainTheme = this.sound.add('menuMusic', { loop: true, volume: 0.4 });
        // REPRODUCE MÚSICA DEL MENÚ
        this.mainTheme.play();

        // AÑADE IMAGEN DE FONDO A LA ESCENA EN POSICIONES CENTRADAS
        this.add.image(512, 378, 'backgroundp');
        // AÑADE IMAGEN DE TÍTULO A LA ESCENA
        this.add.image(512, 400, 'titlep');

        // CREA BOTÓN DE REANUDAR COMO IMAGEN INTERACTIVA
        const resumeBtn = this.add.image(512, 400, 'resumeBtn').setInteractive({ useHandCursor: true });

        // FUNCIÓN QUE SIRVE PARA GESTIONAR HOVER EN BOTÓN REANUDAR
        resumeBtn.on('pointerover', () => {
            // CAMBIA TEXTURA A ESTADO HOVER
            resumeBtn.setTexture('resumeBtnHover');
            // REPRODUCE SONIDO DE HOVER
            this.sound.play('button');
        })

        // FUNCIÓN QUE SIRVE PARA RESTABLECER ESTADO VISUAL AL SALIR EL MOUSE
        resumeBtn.on('pointerout', () => {
            // RESTAURA TEXTURA NORMAL DEL BOTÓN
            resumeBtn.setTexture('resumeBtn');
        })

        // FUNCIÓN QUE SIRVE PARA REANUDAR LA PARTIDA AL HACER CLICK
        resumeBtn.on('pointerdown', () => {
            // LOG CON FINES DE DEPURACIÓN
            console.log('Game Init');
            // REPRODUCE SONIDO DE CLICK
            this.sound.play('buttonClick', {volume:0.5});
            // DETIENE LA MÚSICA DEL MENÚ
            this.mainTheme.stop();
            // DETIENE ESTA ESCENA DE PAUSA
            this.scene.stop();
            // REANUDA LA ESCENA PRINCIPAL DEL JUEGO
            this.scene.resume('GameScene');
        })

        // CREA BOTÓN DE VOLVER AL MENÚ PRINCIPAL COMO IMAGEN INTERACTIVA
        const menuBtn = this.add.image(512, 500, 'menuBtn').setInteractive({ useHandCursor: true });

        // FUNCIÓN QUE SIRVE PARA GESTIONAR HOVER EN BOTÓN MENU
        menuBtn.on('pointerover', () => {
            // CAMBIA TEXTURA A ESTADO HOVER
            menuBtn.setTexture('menuBtnHover');
            // REPRODUCE SONIDO DE HOVER
            this.sound.play('button');
        })

        // FUNCIÓN QUE SIRVE PARA RESTABLECER ESTADO VISUAL DEL BOTÓN MENU
        menuBtn.on('pointerout', () => {
            // RESTAURA TEXTURA NORMAL DEL BOTÓN
            menuBtn.setTexture('menuBtn');
        })

        // FUNCIÓN QUE SIRVE PARA VOLVER AL MENÚ PRINCIPAL AL HACER CLICK
        menuBtn.on('pointerdown', () => {
            // LOG PARA INDICAR RETORNO AL MENÚ
            console.log('BACK To Menu');
            // SE REPRODUCE SONIDO DE CLICK
            this.sound.play('buttonClick', {volume:0.5});
            // SE DETIENE LA ESCENA DE PAUSA
            this.scene.stop();
            // SE DETIENE LA ESCENA DEL JUEGO (POR SI ESTÁ ACTIVA)
            this.scene.stop('GameScene');
            // SE INICIA LA ESCENA PRINCIPAL DEL MENÚ
            this.scene.start('MenuScene');
            // SE REPRODUCE LA MÚSICA DEL MENÚ (ASEGURA QUE SUENE EN LA NUEVA ESCENA)
            this.mainTheme.play();
        })
    }
}