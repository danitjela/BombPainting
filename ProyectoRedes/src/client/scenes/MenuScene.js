// SE IMPORTA PHASER
import Phaser from 'phaser';
import { connectionManager } from '../services/ConnectionManager';

// CLASE QUE SIRVE PARA GESTIONAR LA PANTALLA PRINCIPAL DEL MENÚ
export class MenuScene extends Phaser.Scene {
    // FUNCIÓN QUE SIRVE PARA CONSTRUIR LA ESCENA DEL MENÚ
    constructor() {
        super('MenuScene'); // CREA NOMBRE DE LA ESCENA
    }

    // FUNCIÓN QUE SIRVE PARA CARGAR RECURSOS (IMÁGENES Y SONIDOS)
    preload(){
        // CARGA IMAGEN DE FONDO DEL MENÚ INICIAL
        this.load.image('wallpaper', 'assets/fondoInicio.png');

        // CARGA IMAGEN DEL TÍTULO DEL JUEGO
        this.load.image('gameTitle', 'assets/spritesInterfaz/tituloJuego.png');

        // CARGA IMAGEN BOTÓN JUGAR OFFLINE (NORMAL)
        this.load.image('offline', 'assets/spritesInterfaz/botonOffline.png');
        // CARGA IMAGEN BOTÓN JUGAR OFFLINE (HOVER)
        this.load.image('offlineHover', 'assets/spritesInterfaz/botonOfflineAbierto.png');

        // CARGA IMAGEN BOTÓN JUGAR ONLINE (NORMAL)
        this.load.image('online', 'assets/spritesInterfaz/botonOnline.png');
        // CARGA IMAGEN BOTÓN JUGAR ONLINE (HOVER)
        this.load.image('onlineHover', 'assets/spritesInterfaz/botonOnlineAbierto.png');

        // CARGA IMAGEN BOTÓN CRÉDITOS (NORMAL)
        this.load.image('credits', 'assets/spritesInterfaz/botonCreditos.png');
        // CARGA IMAGEN BOTÓN CRÉDITOS (HOVER)
        this.load.image('creditsHover', 'assets/spritesInterfaz/botonCreditosAbierto.png');

        // CARGA IMAGEN BOTÓN OPCIONES (NORMAL)
        this.load.image('options', 'assets/menuAjustes/ruedaAjustes.png');

        // CARGA IMAGEN BOTÓN SALIR (NORMAL)
        this.load.image('exit', 'assets/spritesInterfaz/botonSalir.png');
        // CARGA IMAGEN BOTÓN SALIR (HOVER)
        this.load.image('exitHover', 'assets/spritesInterfaz/botonSalirAbierto.png');

        // CARGA IMAGEN BOTÓN CÓMIC (NORMAL)
        this.load.image('comicButton', 'assets/botonComic/comicLibroCerrado.png');
        // CARGA IMAGEN BOTÓN CÓMIC (HOVER)
        this.load.image('comicButtonHover', 'assets/botonComic/comicLibroAbierto.png');

        // CARGA MÚSICA DEL MENÚ
        this.load.audio('menuMusic', 'assets/efectosDeSonido/musicaMenu.mp3');
        // CARGA EFECTOS DE SONIDO PARA BOTONES
        this.load.audio('button', 'assets/efectosDeSonido/boton.mp3');
        this.load.audio('buttonClick', 'assets/efectosDeSonido/botonClick.mp3');
    }

    // FUNCIÓN QUE SIRVE PARA CREAR ELEMENTOS VISUALES Y ASIGNAR INTERACCIONES
    create() {
        // REPRODUCCIÓN CONDICIONAL DE LA MÚSICA PRINCIPAL (EVITA DUPLICARLA)
        if (!this.sound.get('menuMusic')) {
            // CREA AUDIO PRINCIPAL, CONFIGURA BUCLE Y VOLUMEN
            this.mainTheme = this.sound.add('menuMusic', { loop: true, volume: 0.4 });
            // REPRODUCE LA MÚSICA DEL MENÚ
            this.mainTheme.play();
        }

        // CREA IMAGEN DE FONDO Y LA ESCALA
        let wallpaper = this.add.image(512, 384, 'wallpaper'); // IMAGEN FONDO
        wallpaper.setScale(2.0); // ESCALA A 2.0

        // AÑADE IMAGEN DEL TÍTULO DEL JUEGO
        this.add.image(540, 384, 'gameTitle'); // IMAGEN TÍTULO

        // CREA BOTÓN DEL CÓMIC (ARRIBA DERECHA) COMO IMAGEN INTERACTIVA
        const comicBtn = this.add.image(this.scale.width - 50, 50, 'comicButton')
            .setInteractive({ useHandCursor: true }) // HABILITA CURSOR MANO
            .setScale(0.5); // ESCALA DEL BOTÓN

        // HOVER EN BOTÓN CÓMIC: CAMBIA TEXTURA Y REPRODUCE EFECTO
        comicBtn.on('pointerover', () => {
            comicBtn.setTexture('comicButtonHover'); // TEXTURA HOVER
            this.sound.play('button'); // SONIDO HOVER
        });
        // POINTER OUT EN BOTÓN CÓMIC: RESTAURA TEXTURA
        comicBtn.on('pointerout', () => {
            comicBtn.setTexture('comicButton'); // RESTAURA TEXTURA
        });
        // POINTER DOWN EN BOTÓN CÓMIC: INICIA/REINICIA ESCENA DEL CÓMIC
        comicBtn.on('pointerdown', () => {
            this.sound.play('buttonClick', {volume:0.5}); // SONIDO CLICK
            this.scene.stop('ComicScene');   // DETIENE CUALQUIER INSTANCIA ANTERIOR
            this.scene.start('ComicScene');  // INICIA ESCENA CÓMIC
        });

        // CREA BOTÓN JUGAR MODO OFFLINE
        const offlineBtn = this.add.image(512, 300, 'offline').setInteractive({ useHandCursor: true });
        // HOVER OFFLINE: CAMBIA TEXTURA Y REPRODUCE SONIDO
        offlineBtn.on('pointerover', () => {
            offlineBtn.setTexture('offlineHover'); // TEXTURA HOVER
            this.sound.play('button'); // SONIDO HOVER
        })
        // POINTER OUT OFFLINE: RESTAURA TEXTURA
        offlineBtn.on('pointerout', () => {
            offlineBtn.setTexture('offline'); // RESTAURA TEXTURA
        })
        // CLICK OFFLINE: INICIA SELECCIÓN DE PERSONAJE
        offlineBtn.on('pointerdown', () => {
            console.log('Game Init'); // LOG DEPURACIÓN
            this.sound.play('buttonClick', {volume:0.5}); // SONIDO CLICK
            this.scene.start('CharacterSelectScene'); // INICIA ESCENA DE SELECCIÓN
        })

        // CREA BOTÓN JUGAR MODO ONLINE
        const onlineBtn = this.add.image(512, 420, 'online').setInteractive({ useHandCursor: true });
        // HOVER ONLINE: CAMBIA TEXTURA Y REPRODUCE SONIDO
        onlineBtn.on('pointerover', () => {
            onlineBtn.setTexture('onlineHover'); // TEXTURA HOVER
            this.sound.play('button'); // SONIDO HOVER
        })
        // POINTER OUT ONLINE: RESTAURA TEXTURA
        onlineBtn.on('pointerout', () => {
            onlineBtn.setTexture('online'); // RESTAURA TEXTURA
        })
        // CLICK ONLINE: MENSAJE DE NO DISPONIBLE (POR AHORA)
        onlineBtn.on('pointerdown', () => {
            this.sound.play('buttonClick', {volume:0.5}); // SONIDO CLICK
            console.log('No disponible'); // LOG INDICANDO ESTADO
        })

        // CREA BOTÓN CRÉDITOS
        const creditsBtn = this.add.image(512, 540, 'credits').setInteractive({ useHandCursor: true });
        // HOVER CRÉDITOS: CAMBIA TEXTURA Y REPRODUCE SONIDO
        creditsBtn.on('pointerover', () => {
            creditsBtn.setTexture('creditsHover'); // TEXTURA HOVER
            this.sound.play('button'); // SONIDO HOVER
        })
        // POINTER OUT CRÉDITOS: RESTAURA TEXTURA
        creditsBtn.on('pointerout', () => {
            creditsBtn.setTexture('credits'); // RESTAURA TEXTURA
        })
        // CLICK CRÉDITOS: INICIA ESCENA DE CRÉDITOS
        creditsBtn.on('pointerdown', () => {
            console.log('Credits Menu'); // LOG DEPURACIÓN
            this.sound.play('buttonClick', {volume:0.5}); // SONIDO CLICK
            this.scene.start('MenuCredits'); // INICIA ESCENA CRÉDITOS
        })


        // CREA BOTÓN OPCIONES
        const optionsBtn = this.add.image(70, 378, 'options').setInteractive({ useHandCursor: true });
        // HOVER CRÉDITOS: CAMBIA TEXTURA Y REPRODUCE SONIDO
        optionsBtn.on('pointerover', () => {
            optionsBtn.setScale(1.2); // TEXTURA HOVER
            this.sound.play('button'); // SONIDO HOVER
        })
        // POINTER OUT CRÉDITOS: RESTAURA TEXTURA
        optionsBtn.on('pointerout', () => {
            optionsBtn.setScale(1.0); // RESTAURA TEXTURA
        })
        // CLICK CRÉDITOS: INICIA ESCENA DE CRÉDITOS
        optionsBtn.on('pointerdown', () => {
            console.log('Options Menu'); // LOG DEPURACIÓN
            this.sound.play('buttonClick', {volume:0.5}); // SONIDO CLICK
            this.scene.start('OptionsScene'); // INICIA ESCENA CRÉDITOS
        })

        // CREA BOTÓN SALIR DEL JUEGO
        const exitBtm = this.add.image(512, 660, 'exit').setInteractive({ useHandCursor: true }); // IMAGEN SALIR
        // HOVER SALIR: CAMBIA TEXTURA Y REPRODUCE SONIDO
        exitBtm.on('pointerover', () => {
            exitBtm.setTexture('exitHover'); // TEXTURA HOVER
            this.sound.play('button'); // SONIDO HOVER
        })
        // POINTER OUT SALIR: RESTAURA TEXTURA
        exitBtm.on('pointerout', () => {
            exitBtm.setTexture('exit'); // RESTAURA TEXTURA
        })
        // CLICK SALIR: DESTRUYE EL JUEGO COMPLETAMENTE
        exitBtm.on('pointerdown', () => {
            console.log('Exit game'); // LOG DEPURACIÓN
            this.sound.play('buttonClick', {volume:0.5}); // SONIDO CLICK
            this.game.destroy(true); // DESTRUYE INSTANCIA DEL JUEGO
        })


        this.connectionText = this.add.text(240, 730, 'Servidor: Comprobando...', {
            fontFamily: 'PixelFont',
            fontSize: '24px',
            color: '#ffff00'
        }).setOrigin(0.5);

        // Listener para cambios de conexión
        this.connectionListener = (data) => {
            this.updateConnectionDisplay(data);
        };
        connectionManager.addListener(this.connectionListener);

    }

    updateConnectionDisplay(data) {
        // Solo actualizar si el texto existe (la escena está creada)
        if (!this.connectionText || !this.scene || !this.scene.isActive('MenuScene')) {
            return;
        }

        try {
            if (data.connected) {
                this.connectionText.setText(`Servidor: ${data.count} usuario(s) conectado(s)`);
                this.connectionText.setColor('#00ff00');
            } else {
                this.connectionText.setText('Servidor: Desconectado');
                this.connectionText.setColor('#ff0000');
            }
        } catch (error) {
            console.error('[MenuScene] Error updating connection display:', error);
        }
    }

    shutdown() {
        // Remover el listener
        if (this.connectionListener) {
            connectionManager.removeListener(this.connectionListener);
        }
    }
}