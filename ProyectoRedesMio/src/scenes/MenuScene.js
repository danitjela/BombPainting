import Phaser from 'phaser';


export class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    preload(){
        this.load.image('wallpaper', 'assets/fondoInicio.png') //Imagen fondo del menú de inicio
        
        this.load.image('gameTitle', 'assets/spritesInterfaz/tituloJuego.png') //Imagen título

        this.load.image('offline', 'assets/spritesInterfaz/botonOffline.png') //Imagen botón jugar offline
        this.load.image('offlineHover', 'assets/spritesInterfaz/botonOfflineAbierto.png') //Imagen botón jugar offline hover

        this.load.image('online', 'assets/spritesInterfaz/botonOnline.png') //Imagen botón jugar online
        this.load.image('onlineHover', 'assets/spritesInterfaz/botonOnlineAbierto.png') //Imagen botón jugar online hover

        this.load.image('credits', 'assets/spritesInterfaz/botonCreditos.png') //Imagen botón créditos
        this.load.image('creditsHover', 'assets/spritesInterfaz/botonCreditosAbierto.png') //Imagen botón créditos hover

        this.load.image('exit', 'assets/spritesInterfaz/botonSalir.png') //Imagen botón salir
        this.load.image('exitHover', 'assets/spritesInterfaz/botonSalirAbierto.png') //Imagen botón salir hover

        this.load.image('comicButton', 'assets/botonComic/comicLibroCerrado.png') //Imagen botón comic 
        this.load.image('comicButtonHover', 'assets/botonComic/comicLibroAbierto.png') //Imagen botón comic hover


        this.load.audio('menuMusic', 'assets/efectosDeSonido/musicaMenu.mp3');
        this.load.audio('button', 'assets/efectosDeSonido/boton.mp3');
        this.load.audio('buttonClick', 'assets/efectosDeSonido/botonClick.mp3');
    }

    create() {
        if (!this.sound.get('menuMusic')) {
            this.mainTheme = this.sound.add('menuMusic', { loop: true, volume: 0.4 });
            this.mainTheme.play();
        }

        let wallpaper = this.add.image(512, 384, 'wallpaper'); //Cargar imagen del fondo
        wallpaper.setScale(2.0);

        this.add.image(540, 384, 'gameTitle'); //Cargar imagen título
        // Botón del cómic (arriba derecha)
        const comicBtn = this.add.image(this.scale.width - 50, 50, 'comicButton')
            .setInteractive({ useHandCursor: true })
            .setScale(0.5); 

        comicBtn.on('pointerover', () => {
            comicBtn.setTexture('comicButtonHover');
            this.sound.play('button');
        });
        comicBtn.on('pointerout', () => {
            comicBtn.setTexture('comicButton');
        });
        comicBtn.on('pointerdown', () => {
            this.sound.play('buttonClick', {volume:0.5});
            this.scene.stop('ComicScene');   // asegurarte de parar cualquier instancia anterior
            this.scene.start('ComicScene');  // iniciar una nueva desde cero
        });

        //Boton jugar modo offline
        const offlineBtn = this.add.image(512, 300, 'offline').setInteractive({ useHandCursor: true });
        offlineBtn.on('pointerover', () => {
            offlineBtn.setTexture('offlineHover');
            this.sound.play('button');
        })
        offlineBtn.on('pointerout', () => {
            offlineBtn.setTexture('offline');
        })
        offlineBtn.on('pointerdown', () => {
            console.log('Game Init');
            this.sound.play('buttonClick', {volume:0.5});
            this.scene.start('CharacterSelectScene');
        })

        //Botón jugar modo online
        const onlineBtn = this.add.image(512, 420, 'online').setInteractive({ useHandCursor: true });
        onlineBtn.on('pointerover', () => {
            onlineBtn.setTexture('onlineHover');
            this.sound.play('button');
        })
        onlineBtn.on('pointerout', () => {
            onlineBtn.setTexture('online');
        })
        onlineBtn.on('pointerdown', () => {
            this.sound.play('buttonClick', {volume:0.5});
            console.log('No disponible');
        })

        //Botón créditos
        const creditsBtn = this.add.image(512, 540, 'credits').setInteractive({ useHandCursor: true });
        creditsBtn.on('pointerover', () => {
            creditsBtn.setTexture('creditsHover');
            this.sound.play('button');
        })
        creditsBtn.on('pointerout', () => {
            creditsBtn.setTexture('credits');
        })
        creditsBtn.on('pointerdown', () => {
            console.log('Credits Menu');
            this.sound.play('buttonClick', {volume:0.5});
            this.scene.start('MenuCredits');
        })

        //Botón salir del juego
        const exitBtm = this.add.image(512, 660, 'exit').setInteractive({ useHandCursor: true });;
        exitBtm.on('pointerover', () => {
            exitBtm.setTexture('exitHover');
            this.sound.play('button');
        })
        exitBtm.on('pointerout', () => {
            exitBtm.setTexture('exit');
        })
        exitBtm.on('pointerdown', () => {
            console.log('Exit game');
            this.sound.play('buttonClick', {volume:0.5});
            this.game.destroy(true);
        })
    }
}