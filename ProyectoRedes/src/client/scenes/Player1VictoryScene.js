// SE IMPORTAN PHASER Y LA ESCENA DEL MENÚ
import Phaser from 'phaser';
import { MenuScene } from './MenuScene';

// CLASE QUE SIRVE PARA MOSTRAR LA PANTALLA DE VICTORIA DEL JUGADOR 1
export class Player1VictoryScene extends Phaser.Scene {
    // FUNCIÓN QUE SIRVE PARA CONSTRUIR LA ESCENA DE VICTORIA
    constructor() {
        super('Player1VictoryScene'); // SE CREA EL NOMBRE DE LA ESCENA
    }

    // FUNCIÓN QUE SIRVE PARA CARGAR RECURSOS (IMÁGENES Y SONIDOS)
    preload(){
        // IMAGEN LETRAS DE VICTORIA
        this.load.image('title', 'assets/letrasVictoria/letrasVictoriaColor.png');
        // IMAGEN DE FONDO
        this.load.image('background', 'assets/FondoInicioColor.png');
        // IMAGEN BOTÓN VOLVER (NORMAL)
        this.load.image('back', 'assets/letrasVictoria/botonVolver.png');
        // IMAGEN BOTÓN VOLVER (HOVER)
        this.load.image('backHover', 'assets/letrasVictoria/botonVolverAbierto.png');

        // FRAMES ANIMACIÓN PACA
        this.load.image('pacaWin1','assets/personajes/sprites_Paca/Win/Paca_win1.png');
        this.load.image('pacaWin2','assets/personajes/sprites_Paca/Win/Paca_win2.png');
        this.load.image('pacaWin3','assets/personajes/sprites_Paca/Win/Paca_win3.png');

        // FRAMES ANIMACIÓN PERSONAJE3
        this.load.image('chicoWin1','assets/personajes/sprites_personaje3/Win/Chico_win1.png');
        this.load.image('chicoWin2','assets/personajes/sprites_personaje3/Win/Chico_win2.png');
        this.load.image('chicoWin3','assets/personajes/sprites_personaje3/Win/Chico_win3.png');

        // MÚSICA Y EFECTOS DE BOTÓN
        this.load.audio('menuMusic', 'assets/efectosDeSonido/musicaMenu.mp3');
        this.load.audio('button', 'assets/efectosDeSonido/boton.mp3');
        this.load.audio('buttonClick', 'assets/efectosDeSonido/botonClick.mp3');
    }

    // FUNCIÓN QUE SIRVE PARA CREAR ANIMACIONES, SPRITES, AUDIO Y BOTÓN DE VOLVER
    create(){
        this.sound.stopAll();
        // CREA ANIMACIÓN PARA PACA
        this.anims.create({
            key: 'paca_win',
            frames: [
                { key: 'pacaWin1' }, // FRAME 1
                { key: 'pacaWin2' }, // FRAME 2
                { key: 'pacaWin3' }  // FRAME 3
            ],
            frameRate: 8, // VELOCIDAD DE LA ANIMACIÓN
            repeat: -1    // REPITE INDEFINIDAMENTE
        });

        // CREA ANIMACIÓN PARA PERSONAJE3
        this.anims.create({
            key: 'personaje3_win',
            frames: [
                { key: 'chicoWin1' }, // FRAME 1
                { key: 'chicoWin2' }, // FRAME 2
                { key: 'chicoWin3' }  // FRAME 3
            ],
            frameRate: 8, // VELOCIDAD DE LA ANIMACIÓN
            repeat: -1    // REPITE INDEFINIDAMENTE
        });

        // CREA Y REPRODUCE MÚSICA PRINCIPAL DE LA ESCENA
        this.mainTheme = this.sound.add('menuMusic', { loop: true });
        this.mainTheme.play(); // REPRODUCE MÚSICA

        // AÑADE IMAGEN DE FONDO Y LA ESCALA
        this.wallpaper = this.add.image(512, 378,'background');
        this.wallpaper.setScale(2); // ESCALA FONDO

        // AÑADE IMAGEN DEL TÍTULO DE VICTORIA
        this.add.image(512, 500,'title');

        // CREA SPRITE DE PACA, REPRODUCE ANIMACIÓN Y ESCALA
        this.pacaSprite = this.add.sprite(100, 600, 'pacaWin1');
        this.pacaSprite.play('paca_win'); // REPRODUCE ANIMACIÓN PACA
        this.pacaSprite.setScale(2.5); // ESCALA SPRITE PACA

        // CREA SPRITE DE PERSONAJE3, REPRODUCE ANIMACIÓN Y ESCALA
        this.personaje3Sprite = this.add.sprite(200, 600, 'chicoWin1');
        this.personaje3Sprite.play('personaje3_win'); // REPRODUCE ANIMACIÓN PERSONAJE3
        this.personaje3Sprite.setScale(2.5); // ESCALA SPRITE PERSONAJE3

        // CREA BOTÓN VOLVER 
        const backButton = this.add.image(512, 470, 'back').setInteractive({ useHandCursor: true });
        backButton.setScale(1.5); // ESCALA BOTÓN

        // APECTO BOTÓN VOLVER
        // HOVER EN BOTÓN VOLVER: CAMBIA TEXTURA Y REPRODUCE EFECTO
        backButton.on('pointerover', () => {
            backButton.setTexture('backHover'); // CAMBIA A TEXTURA HOVER
            this.sound.play('button'); // REPRODUCE SONIDO HOVER
        })
        // POINTER OUT EN BOTÓN VOLVER: RESTAURA TEXTURA
        backButton.on('pointerout', () => {
            backButton.setTexture('back'); // RESTAURA TEXTURA NORMAL
        })
        // CLICK EN BOTÓN VOLVER: REPRODUCE CLICK Y VUELVE AL MENÚ PRINCIPAL
        backButton.on('pointerdown', () => {
            this.sound.play('buttonClick', {volume:0.5}); // REPRODUCE SONIDO CLICK
            this.scene.start('MenuScene'); // INICIA ESCENA MENU
        })
    }
}