import Phaser from 'phaser';

export class Player2VictoryScene extends Phaser.Scene {
    constructor() {
        super('Player2VictoryScene');
    }

    preload(){
        this.load.image('title2', 'assets/letrasVictoria/letrasVictoriaGrises.png');
        this.load.image('background2', 'assets/Cielodestruido.png');
        this.load.image('back2', 'assets/letrasVictoria/botonVolverGris.png');
        this.load.image('backHover2', 'assets/letrasVictoria/botonVolverAbiertoGris.png');

        this.load.image('acopWin1','assets/personajes/sprites_Acop/Win/Acop_win1.png');
        this.load.image('acopWin2','assets/personajes/sprites_Acop/Win/Acop_win2.png');
        this.load.image('acopWin3','assets/personajes/sprites_Acop/Win/Acop_win3.png');

        this.load.image('chicaWin1','assets/personajes/sprites_personaje2/Win/Chica_win1.png');
        this.load.image('chicaWin2','assets/personajes/sprites_personaje2/Win/Chica_win2.png');
        this.load.image('chicaWin3','assets/personajes/sprites_personaje2/Win/Chica_win3.png');

        this.load.audio('menuMusic', 'assets/efectosDeSonido/musicaMenu.mp3');
        this.load.audio('button', 'assets/efectosDeSonido/boton.mp3');
        this.load.audio('buttonClick', 'assets/efectosDeSonido/botonClick.mp3');
    }

    create(){
        this.anims.create({
            key: 'acop_win',
            frames: [
                { key: 'acopWin1' },
                { key: 'acopWin2' },
                { key: 'acopWin3' }
            ],
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: 'personaje2_win',
            frames: [
                { key: 'chicaWin1' },
                { key: 'chicaWin2' },
                { key: 'chicaWin3' }
            ],
            frameRate: 8,
            repeat: -1
        });
        this.mainTheme = this.sound.add('menuMusic', { loop: true });
        this.mainTheme.play();

        this.wallpaper = this.add.image(512, 378,'background2');
        this.wallpaper.setScale(2);
        this.add.image(512, 500,'title2');

        this.pacaSprite = this.add.sprite(100, 600, 'acopWin1');
        this.pacaSprite.play('acop_win');
        this.pacaSprite.setScale(2.5);

        this.personaje3Sprite = this.add.sprite(200, 600, 'chicaWin1');
        this.personaje3Sprite.play('personaje2_win');
        this.personaje3Sprite.setScale(2.5);

        const backButton = this.add.image(512, 470, 'back2').setInteractive({ useHandCursor: true });
        backButton.setScale(1.5);
        backButton.on('pointerover', () => {
            backButton.setTexture('backHover2');
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