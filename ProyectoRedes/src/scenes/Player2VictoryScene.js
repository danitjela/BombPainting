// MÓDULOS: IMPORTA PHASER
import Phaser from 'phaser';

// CLASE QUE SIRVE PARA MOSTRAR LA PANTALLA DE VICTORIA DEL JUGADOR 2
export class Player2VictoryScene extends Phaser.Scene {
    // FUNCIÓN QUE SIRVE PARA CONSTRUIR LA ESCENA DE VICTORIA
    constructor() {
        super('Player2VictoryScene'); // CREA NOMBRE DE LA ESCENA
    }

    // FUNCIÓN QUE SIRVE PARA CARGAR RECURSOS (IMÁGENES Y SONIDOS)
    preload(){
        // CARGA LETRAS GRISES DE VICTORIA
        this.load.image('title2', 'assets/letrasVictoria/letrasVictoriaGrises.png');
        // CARGA IMAGEN DE FONDO
        this.load.image('background2', 'assets/Cielodestruido.png');
        // CARGA BOTÓN VOLVER GRIS (NORMAL)
        this.load.image('back2', 'assets/letrasVictoria/botonVolverGris.png');
        // CARGA BOTÓN VOLVER GRIS (HOVER)
        this.load.image('backHover2', 'assets/letrasVictoria/botonVolverAbiertoGris.png');

        //CARGA DEL BOCADILLO DE TEXTO DE ACOP
        this.load.image('bocAcop','assets/letrasVictoria/bocadilloAcop.png');

        // CARGA FRAMES ANIMACIÓN ACOP
        this.load.image('acopWin1','assets/personajes/sprites_Acop/Win/Acop_win1.png');
        this.load.image('acopWin2','assets/personajes/sprites_Acop/Win/Acop_win2.png');
        this.load.image('acopWin3','assets/personajes/sprites_Acop/Win/Acop_win3.png');

        // CARGA FRAMES ANIMACIÓN PERSONAJE2 (CHICA)
        this.load.image('chicaWin1','assets/personajes/sprites_personaje2/Win/Chica_win1.png');
        this.load.image('chicaWin2','assets/personajes/sprites_personaje2/Win/Chica_win2.png');
        this.load.image('chicaWin3','assets/personajes/sprites_personaje2/Win/Chica_win3.png');

        // CARGA MÚSICA Y EFECTOS DE BOTÓN
        this.load.audio('menuMusic', 'assets/efectosDeSonido/musicaMenu.mp3');
        this.load.audio('button', 'assets/efectosDeSonido/boton.mp3');
        this.load.audio('buttonClick', 'assets/efectosDeSonido/botonClick.mp3');
    }

    // FUNCIÓN QUE SIRVE PARA CREAR ANIMACIONES, SPRITES, AUDIO Y BOTÓN DE VOLVER
    create(){
        // ANIMACIÓN PARA ACOP
        this.anims.create({
            key: 'acop_win',
            frames: [
                { key: 'acopWin1' }, // FRAME 1
                { key: 'acopWin2' }, // FRAME 2
                { key: 'acopWin3' }  // FRAME 3
            ],
            frameRate: 8, // VELOCIDAD ANIMACIÓN
            repeat: -1    // REPITE INDEFINIDAMENTE
        });

        // ANIMACIÓN PARA PERSONAJE2 (CHICA)
        this.anims.create({
            key: 'personaje2_win',
            frames: [
                { key: 'chicaWin1' }, // FRAME 1
                { key: 'chicaWin2' }, // FRAME 2
                { key: 'chicaWin3' }  // FRAME 3
            ],
            frameRate: 8, // VELOCIDAD ANIMACIÓN
            repeat: -1    // REPITE INDEFINIDAMENTE
        });

        // CREA Y REPRODUCE MÚSICA PRINCIPAL DE LA ESCENA
        this.mainTheme = this.sound.add('menuMusic', { loop: true });
        this.mainTheme.play(); // REPRODUCE MÚSICA

        // AÑADE IMAGEN DE FONDO Y LA ESCALA
        this.wallpaper = this.add.image(512, 378,'background2'); // IMAGEN FONDO
        this.wallpaper.setScale(2); // ESCALA FONDO

        // AÑADE IMAGEN DEL TÍTULO DE VICTORIA
        this.add.image(512, 500,'title2'); // IMAGEN TÍTULO

        // CREA SPRITE ACOP, REPRODUCE ANIMACIÓN Y ESCALA
        this.pacaSprite = this.add.sprite(100, 600, 'acopWin1'); // SPRITE ACOP
        this.pacaSprite.play('acop_win'); // REPRODUCE ANIMACIÓN ACOP
        this.pacaSprite.setScale(2.5); // ESCALA SPRITE ACOP

        // SE CREA EL SPRITE PERSONAJE2, REPRODUCE ANIMACIÓN Y ESCALA
        this.personaje3Sprite = this.add.sprite(200, 600, 'chicaWin1'); // SPRITE CHICA
        this.personaje3Sprite.play('personaje2_win'); // REPRODUCE ANIMACIÓN CHICA
        this.personaje3Sprite.setScale(2.5); // ESCALA SPRITE CHICA

        //SE CREA EL SPRITE DEL BOCADILLO DE TEXTO
        const bocadillo = this.add.image(150, 510, 'bocAcop');
        bocadillo.setScale(0.5);

        
        // SE CREA EL BOTÓN DE VOLVER
        const backButton = this.add.image(512, 470, 'back2').setInteractive({ useHandCursor: true }); // IMAGEN BOTÓN
        backButton.setScale(1.5); // ESCALA BOTÓN

        // APARIENCIAS DEL BOTÓN DE VOLVER
        // HOVER EN BOTÓN VOLVER: CAMBIA TEXTURA Y REPRODUCE EFECTO
        backButton.on('pointerover', () => {
            backButton.setTexture('backHover2'); // TEXTURA HOVER
            this.sound.play('button'); // SONIDO HOVER
        })
        // POINTER OUT EN BOTÓN VOLVER: RESTAURA TEXTURA
        backButton.on('pointerout', () => {
            backButton.setTexture('back2'); // RESTAURA TEXTURA
        })
        // CLICK EN BOTÓN VOLVER: REPRODUCE CLICK Y VUELVE AL MENÚ PRINCIPAL
        backButton.on('pointerdown', () => {
            this.sound.play('buttonClick', {volume:0.5}); // SONIDO CLICK
            this.scene.start('MenuScene'); // INICIA ESCENA MENU
        })
    }
}