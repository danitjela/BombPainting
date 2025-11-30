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

        this.load.image('pacaWin1','assets/personajes/sprites_Paca/Win/Paca_win1.png');
        this.load.image('pacaWin2','assets/personajes/sprites_Paca/Win/Paca_win2.png');
        this.load.image('pacaWin3','assets/personajes/sprites_Paca/Win/Paca_win3.png');

        this.load.image('chicoWin1','assets/personajes/sprites_personaje3/Win/Chico_win1.png');
        this.load.image('chicoWin2','assets/personajes/sprites_personaje3/Win/Chico_win2.png');
        this.load.image('chicoWin3','assets/personajes/sprites_personaje3/Win/Chico_win3.png');

        this.load.audio('menuMusic', 'assets/efectosDeSonido/musicaMenu.mp3');
        this.load.audio('button', 'assets/efectosDeSonido/boton.mp3');
        this.load.audio('buttonClick', 'assets/efectosDeSonido/botonClick.mp3');
    }

    create(){
        this.anims.create({
            key: 'paca_win',
            frames: [
                { key: 'pacaWin1' },
                { key: 'pacaWin2' },
                { key: 'pacaWin3' }
            ],
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'personaje3_win',
            frames: [
                { key: 'chicoWin1' },
                { key: 'chicoWin2' },
                { key: 'chicoWin3' }
            ],
            frameRate: 8,
            repeat: -1
        });

        this.mainTheme = this.sound.add('menuMusic', { loop: true });
        this.mainTheme.play();

        this.wallpaper = this.add.image(512, 378,'background');
        this.wallpaper.setScale(2);
        this.add.image(512, 500,'title');

        this.pacaSprite = this.add.sprite(100, 600, 'pacaWin1');
        this.pacaSprite.play('paca_win');
        this.pacaSprite.setScale(2.5);

        this.personaje3Sprite = this.add.sprite(200, 600, 'chicoWin1');
        this.personaje3Sprite.play('personaje3_win');
        this.personaje3Sprite.setScale(2.5);

        const backButton = this.add.image(512, 470, 'back').setInteractive({ useHandCursor: true });
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