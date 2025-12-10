// IMPORTA PHASER Y ENTIDADES NECESARIAS (PLAYER, BOMB) Y GESTORES DE MAPA
import Phaser from 'phaser';
import { Player } from '../entities/Player';
import { Bomb } from '../entities/Bomb';

import { MapManager } from '../map/MapManager';
import { DestructibleWall } from '../map/DestructibleWall';
import { connectionManager } from '../services/ConnectionManager';

// FUNCIÓN QUE SIRVE PARA GESTIONAR LA LÓGICA PRINCIPAL DEL JUEGO 
export class GameScene extends Phaser.Scene {

    // FUNCIÓN QUE SIRVE PARA INICIALIZAR LA ESCENA Y SU KEY
    constructor() {
        // LLAMA A CONSTRUCTOR PADRE Y ASIGNA KEY
        super('GameScene');
    }

    // FUNCIÓN QUE SIRVE PARA INICIALIZAR ESTRUCTURAS ANTES DE CARGAR RECURSOS
    init() {
        // CREA MAPA DE JUGADORES
        this.players = new Map();
        // ARRAY DE MAPEOS DE INPUT
        this.inputMappings = [];
        // FLAG PAUSA
        this.isPaused = false;
    }

    // FUNCIÓN QUE SIRVE PARA CARGAR RECURSOS GRAFICOS Y SONIDOS
    preload() {
        // SUELO
        this.load.image('floor1', 'assets/spritesFondo/Sprites_cesped/C_1.png'); // CARGA floor1
        this.load.image('floor2', 'assets/spritesFondo/Sprites_cesped/C_2.png'); // CARGA floor2

        this.load.image('floor1G', 'assets/spritesFondo/Sprites_cesped/GC_1.png'); // CARGA variante
        this.load.image('floor2G', 'assets/spritesFondo/Sprites_cesped/GC_2.png'); // CARGA variante

        // MUROS LATERALES - ESQUINAS
        this.load.image('LTCorner', 'assets/spritesFondo/Sprites_muros/M_EsqSI.png');
        this.load.image('RTCorner', 'assets/spritesFondo/Sprites_muros/M_EsqSD.png');
        this.load.image('LBCorner', 'assets/spritesFondo/Sprites_muros/M_EsqII.png');
        this.load.image('RBCorner', 'assets/spritesFondo/Sprites_muros/M_EsqID.png');

        // MUROS LATERALES - BORDES
        this.load.image('LBorder', 'assets/spritesFondo/Sprites_muros/M_LatI.png');
        this.load.image('RBorder', 'assets/spritesFondo/Sprites_muros/M_LatD.png');
        this.load.image('TBorder', 'assets/spritesFondo/Sprites_muros/M_Sup.png');
        this.load.image('BBorder', 'assets/spritesFondo/Sprites_muros/M_Inf.png');

        // COLUMNAS 
        // IZQUIERDA
        this.load.image('LColumn1', 'assets/spritesFondo/Sprites_muros/M_LatEsp3.png');
        this.load.image('LColumn2', 'assets/spritesFondo/Sprites_muros/M_LatEsp4.png');

        // DERECHA
        this.load.image('RColumn1', 'assets/spritesFondo/Sprites_muros/M_LatEsp1.png');
        this.load.image('RColumn2', 'assets/spritesFondo/Sprites_muros/M_LatEsp2.png');

        // SUPERIOR
        this.load.image('TColumn1', 'assets/spritesFondo/Sprites_muros/M_EspSup1.png');
        this.load.image('TColumn2', 'assets/spritesFondo/Sprites_muros/M_EspSup2.png');

        // INFERIOR
        this.load.image('BColumn1', 'assets/spritesFondo/Sprites_muros/M_EspSup3.png');
        this.load.image('BColumn2', 'assets/spritesFondo/Sprites_muros/M_EspSup4.png');

        // ARBUSTOS INROMPIBLES (ARRAY DE TEXTURAS)
        this.load.image('Bush2', 'assets/spritesFondo/Sprites_otros/Muro_color002.png');
        this.load.image('Bush3', 'assets/spritesFondo/Sprites_otros/Muro_color003.png');
        this.load.image('Bush4', 'assets/spritesFondo/Sprites_otros/Muro_color004.png');
        this.load.image('Bush5', 'assets/spritesFondo/Sprites_otros/Muro_color005.png');
        this.load.image('Bush6', 'assets/spritesFondo/Sprites_otros/Muro_color006.png');
        this.load.image('Bush7', 'assets/spritesFondo/Sprites_otros/Muro_color007.png');
        this.load.image('Bush8', 'assets/spritesFondo/Sprites_otros/Muro_color008.png');
        this.load.image('Bush9', 'assets/spritesFondo/Sprites_otros/Muro_color009.png');
        this.load.image('Bush10', 'assets/spritesFondo/Sprites_otros/Muro_color010.png');
        this.load.image('Bush11', 'assets/spritesFondo/Sprites_otros/Muro_color011.png');
        this.load.image('Bush12', 'assets/spritesFondo/Sprites_otros/Muro_color012.png');
        this.load.image('Bush13', 'assets/spritesFondo/Sprites_otros/Muro_color013.png');
        this.load.image('Bush14', 'assets/spritesFondo/Sprites_otros/Muro_color014.png');
        this.load.image('Bush15', 'assets/spritesFondo/Sprites_otros/Muro_color015.png');
        this.load.image('Bush16', 'assets/spritesFondo/Sprites_otros/Muro_color016.png');
        this.load.image('Bush17', 'assets/spritesFondo/Sprites_otros/Muro_color017.png');
        this.load.image('Bush18', 'assets/spritesFondo/Sprites_otros/Muro_color018.png');
        this.load.image('Bush19', 'assets/spritesFondo/Sprites_otros/Muro_color019.png');
        this.load.image('Bush20', 'assets/spritesFondo/Sprites_otros/Muro_color020.png');
        this.load.image('Bush21', 'assets/spritesFondo/Sprites_otros/Muro_color021.png');
        this.load.image('Bush22', 'assets/spritesFondo/Sprites_otros/Muro_color022.png');

        // CAJA DESTRUCTIBLE
        this.load.image('Box', 'assets/spritesFondo/Sprites_otros/Caja.png');

        // PERSONAJES - PACA (SPRITES DE MOVIMIENTO E IDLE)
        // ARRIBA
        this.load.image('pacaUpMove1', 'assets/personajes/sprites_Paca/PacaColor/walk/Paca_At1.png');
        this.load.image('pacaUpMove2', 'assets/personajes/sprites_Paca/PacaColor/walk/Paca_At2.png');
        this.load.image('pacaUpMove3', 'assets/personajes/sprites_Paca/PacaColor/walk/Paca_At2.png');

        // ABAJO
        this.load.image('pacaDownMove1', 'assets/personajes/sprites_Paca/PacaColor/walk/Paca_Arr1.png');
        this.load.image('pacaDownMove2', 'assets/personajes/sprites_Paca/PacaColor/walk/Paca_Arr2.png');
        this.load.image('pacaDownMove3', 'assets/personajes/sprites_Paca/PacaColor/walk/Paca_Arr2.png');

        // DERECHA
        this.load.image('pacaRightMove1', 'assets/personajes/sprites_Paca/PacaColor/walk/Paca_Dch1.png');
        this.load.image('pacaRightMove2', 'assets/personajes/sprites_Paca/PacaColor/walk/Paca_Dch2.png');
        this.load.image('pacaRightMove3', 'assets/personajes/sprites_Paca/PacaColor/walk/Paca_Dch3.png');

        // IZQUIERDA
        this.load.image('pacaLeftMove1', 'assets/personajes/sprites_Paca/PacaColor/walk/Paca_Izq1.png');
        this.load.image('pacaLeftMove2', 'assets/personajes/sprites_Paca/PacaColor/walk/Paca_Izq2.png');
        this.load.image('pacaLeftMove3', 'assets/personajes/sprites_Paca/PacaColor/walk/Paca_Izq3.png');

        // IDLE
        this.load.image('pacaIdle1', 'assets/personajes/sprites_Paca/PacaColor/idle/PacaArrA.png');
        this.load.image('pacaIdle2', 'assets/personajes/sprites_Paca/PacaColor/idle/PacaArrB.png');

        // ACOP (SPRITES)
        // ARRIBA
        this.load.image('acopUpMove1', 'assets/personajes/sprites_Acop/Gris/walk/atras/acopGrisDerecha.png');
        this.load.image('acopUpMove2', 'assets/personajes/sprites_Acop/Gris/walk/atras/acopGrisMedio.png');
        this.load.image('acopUpMove3', 'assets/personajes/sprites_Acop/Gris/walk/atras/acopGrisIzquierda.png');

        // ABAJO
        this.load.image('acopDownMove1', 'assets/personajes/sprites_Acop/Gris/walk/frente/acopGrisDerecha.png');
        this.load.image('acopDownMove2', 'assets/personajes/sprites_Acop/Gris/walk/frente/acopGrisMedio.png');
        this.load.image('acopDownMove3', 'assets/personajes/sprites_Acop/Gris/walk/frente/acopGrisIzquierda.png');

        // DERECHA
        this.load.image('acopRightMove1', 'assets/personajes/sprites_Acop/Gris/walk/derecha/acopGrisAndar1.png');
        this.load.image('acopRightMove2', 'assets/personajes/sprites_Acop/Gris/walk/derecha/acopGrisAndarMedio.png');
        this.load.image('acopRightMove3', 'assets/personajes/sprites_Acop/Gris/walk/derecha/acopGrisAndar2.png');

        // IZQUIERDA
        this.load.image('acopLeftMove1', 'assets/personajes/sprites_Acop/Gris/walk/izquierda/acopGrisAndar1.png');
        this.load.image('acopLeftMove2', 'assets/personajes/sprites_Acop/Gris/walk/izquierda/acopGrisAndarMedio.png');
        this.load.image('acopLeftMove3', 'assets/personajes/sprites_Acop/Gris/walk/izquierda/acopGrisAndar2.png');

        // IDLE
        this.load.image('acopIdle1', 'assets/personajes/sprites_Acop/Gris/idle/frente/acopGrisAbajo.png');
        this.load.image('acopIdle2', 'assets/personajes/sprites_Acop/Gris/idle/frente/acopGrisArriba.png');

        // PERSONAJE2 (SPRITES)
        // ARRIBA
        this.load.image('personaje2UpMove1', 'assets/personajes/sprites_personaje2/Gris/walk/atras/personaje2GrisDerecha.png');
        this.load.image('personaje2UpMove2', 'assets/personajes/sprites_personaje2/Gris/walk/atras/personaje2GrisMedio.png');
        this.load.image('personaje2UpMove3', 'assets/personajes/sprites_personaje2/Gris/walk/atras/personaje2GrisIzquierda.png');

        // ABAJO
        this.load.image('personaje2DownMove1', 'assets/personajes/sprites_personaje2/Gris/walk/frente/personaje2GrisDerecha.png');
        this.load.image('personaje2DownMove2', 'assets/personajes/sprites_personaje2/Gris/walk/frente/personaje2GrisMedio.png');
        this.load.image('personaje2DownMove3', 'assets/personajes/sprites_personaje2/Gris/walk/frente/personaje2GrisIzquierda.png');

        // DERECHA
        this.load.image('personaje2RightMove1', 'assets/personajes/sprites_personaje2/Gris/walk/derecha/personaje2GrisAndar1.png');
        this.load.image('personaje2RightMove2', 'assets/personajes/sprites_personaje2/Gris/walk/derecha/personaje2GrisAndarMedio.png');
        this.load.image('personaje2RightMove3', 'assets/personajes/sprites_personaje2/Gris/walk/derecha/personaje2GrisAndar2.png');

        // IZQUIERDA
        this.load.image('personaje2LeftMove1', 'assets/personajes/sprites_personaje2/Gris/walk/izquierda/personaje2GrisAndar1.png');
        this.load.image('personaje2LeftMove2', 'assets/personajes/sprites_personaje2/Gris/walk/izquierda/personaje2GrisAndarMedio.png');
        this.load.image('personaje2LeftMove3', 'assets/personajes/sprites_personaje2/Gris/walk/izquierda/personaje2GrisAndar2.png');

        // IDLE
        this.load.image('personaje2Idle1', 'assets/personajes/sprites_personaje2/Gris/idle/frente/personaje2GrisArriba.png');
        this.load.image('personaje2Idle2', 'assets/personajes/sprites_personaje2/Gris/idle/frente/personaje2GrisAbajo.png');

        // PERSONAJE3 (SPRITES)
        // ARRIBA
        this.load.image('personaje3UpMove1', 'assets/personajes/sprites_personaje3/ChicoColor/Walk/Chico_At1.png');
        this.load.image('personaje3UpMove2', 'assets/personajes/sprites_personaje3/ChicoColor/Walk/Chico_At2.png');
        this.load.image('personaje3UpMove3', 'assets/personajes/sprites_personaje3/ChicoColor/Walk/Chico_At3.png');

        // ABAJO
        this.load.image('personaje3DownMove1', 'assets/personajes/sprites_personaje3/ChicoColor/Walk/Chico_Arr1.png');
        this.load.image('personaje3DownMove2', 'assets/personajes/sprites_personaje3/ChicoColor/Walk/Chico_Arr2.png');
        this.load.image('personaje3DownMove3', 'assets/personajes/sprites_personaje3/ChicoColor/Walk/Chico_Arr3.png');

        // DERECHA
        this.load.image('personaje3RightMove1', 'assets/personajes/sprites_personaje3/ChicoColor/Walk/Chico_Dch1.png');
        this.load.image('personaje3RightMove2', 'assets/personajes/sprites_personaje3/ChicoColor/Walk/Chico_Dch2.png');
        this.load.image('personaje3RightMove3', 'assets/personajes/sprites_personaje3/ChicoColor/Walk/Chico_Dch3.png');

        // IZQUIERDA
        this.load.image('personaje3LeftMove1', 'assets/personajes/sprites_personaje3/ChicoColor/Walk/Chico_Izq1.png');
        this.load.image('personaje3LeftMove2', 'assets/personajes/sprites_personaje3/ChicoColor/Walk/Chico_Izq2.png');
        this.load.image('personaje3LeftMove3', 'assets/personajes/sprites_personaje3/ChicoColor/Walk/Chico_Izq3.png');

        // IDLE
        this.load.image('personaje3Idle1', 'assets/personajes/sprites_personaje3/ChicoColor/Idle/ChicoArrA.png');
        this.load.image('personaje3Idle2', 'assets/personajes/sprites_personaje3/ChicoColor/Idle/ChicoArrB.png');

        // BOMBAS - PARPADEO
        this.load.image('bomb1', 'assets/bombas/animacion2/animacion1Grande.png');
        this.load.image('bomb2', 'assets/bombas/animacion2/animacion2Grande.png');

        // EXPLOSIONES (FRAMES)
        this.load.image('explosion1', 'assets/bombas/explosion/explosion1.png');
        this.load.image('explosion2', 'assets/bombas/explosion/explosion2.png');
        this.load.image('explosion3', 'assets/bombas/explosion/explosion3.png');
        this.load.image('explosion4', 'assets/bombas/explosion/explosion4.png');
        this.load.image('explosion5', 'assets/bombas/explosion/explosion5.png');
        this.load.image('explosion6', 'assets/bombas/explosion/explosion6.png');

        // MANCHAS
        this.load.image('stain1', 'assets/manchas/manchaAmarilla.png');
        this.load.image('decolored_stain1', 'assets/manchas/manchaAmarillaGris.png');
        this.load.image('stain2', 'assets/manchas/manchaNaranja.png');
        this.load.image('decolored_stain2', 'assets/manchas/manchaNaranjaGris.png');
        this.load.image('stain3', 'assets/manchas/manchaRoja.png');
        this.load.image('decolored_stain3', 'assets/manchas/manchaRojaGris.png');

        // CORAZONES
        this.load.image('heart', 'assets/spriteCorazones/corazonColor.png');
        this.load.image('emptyHeart', 'assets/spriteCorazones/corazonVacio.png');

        // POWERUPS
        this.load.image('boostMoreBombs', 'assets/boost/boostBombas.png');
        this.load.image('boostBiggerExplosion', 'assets/boost/boostExplosionGrande.png');
        this.load.image('boostFasterExplosion', 'assets/boost/boostExploxionRapida.png');
        this.load.image('boostMoreLife', 'assets/boost/boostVida.png');

        // TUTORIAL
        this.load.image('tuto', 'assets/tutorialJuego/tutorialJuegoRelleno.png');
        this.load.image('escTuto',"assets/tutorialJuego/salirTuto.png");

        // SONIDOS DE JUEGO
        this.load.audio('gameMusic', 'assets/efectosDeSonido/musicaGamePlay.mp3');
        this.load.audio('explosion', 'assets/efectosDeSonido/explosion2.mp3');
        this.load.audio('loseLife', 'assets/efectosDeSonido/perderVida.mp3');
        this.load.audio('bomb', 'assets/efectosDeSonido/ponerBomba.mp3');
        this.load.audio('specialBomb', 'assets/efectosDeSonido/ponerBombaEspecial.mp3');
        this.load.audio('powerUp', 'assets/efectosDeSonido/powerUp.mp3');
    }

    // FUNCIÓN QUE SIRVE PARA CREAR OBJETOS DE ESCENA, MÚSICA, MAPA Y JUGADORES
    create() {
        // CREA Y REPRODUCE MÚSICA DE GAMEPLAY EN LOOP
        this.gameplayMusic = this.sound.add('gameMusic', { loop: true, volume: 0.1 });
        this.gameplayMusic.play();

        // CREA MAP MANAGER Y GENERA MAPA
        this.mapManager = new MapManager(this);
        this.mapManager.createMap();

        // CREA TECLA ESCAPE
        this.escapeKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

        // CREA ANIMACIONES
        this.createAnimations();
        // CONFIGURA JUGADORES
        this.setUpPlayers();

        // AÑADE INDICADORES DE TUTORIAL EN PANTALLA
        this.esctutorial = this.add.image(275,100,'escTuto'); // ICONO ESC
        this.esctutorial.setScale(0.4); // ESCALA
        this.esctutorial.setDepth(21); // DEPTH

        this.tutorial = this.add.image(512,378, 'tuto'); // IMAGEN DE TUTORIAL
        this.tutorial.setScale(1.5); // ESCALA
        this.tutorial.setDepth(20); // DEPTH

        // FLAG QUE INDICA SI EL JUEGO HA COMENZADO (TRAS CERRAR EL TUTORIAL)
        this.gameStarted = false;

        // EVENTO AL RESUMIR ESCENA
        this.events.on('resume', () => {
            this.isPaused = false;           // RESETEA FLAG PAUSA
            this.gameplayMusic.resume();     // REANUDA MÚSICA
        });

        // AÑADE COLISIONES ENTRE JUGADORES Y MUROS (EXTERIORES / INTERIORES / DESTRUCTIBLES)
        this.players.forEach(player => {
            // COLISIÓN CON MUROS EXTERIORES
            this.physics.add.collider(player.sprite, this.mapManager.exteriorWalls);
            // COLISIÓN CON MUROS INTERIORES
            this.physics.add.collider(player.sprite, this.mapManager.interiorWalls);
            // COLISIÓN CON CADA MURO DESTRUCTIBLE (SPRITE)
            this.mapManager.destructibleWalls.forEach(wall => {
                this.physics.add.collider(player.sprite, wall.sprite);
            });
        });

        // UI
        // TEXTO VIDA JUGADOR 1
        const player1Life = this.add.text(20, 16, 'Vida Jugador 1: ');
        player1Life.setFontSize('32px'); // TAMAÑO TEXTO
        player1Life.setStroke('#000000',3); // TRAZO
        player1Life.setColor('#ff0000ff'); // COLOR

        // TEXTO VIDA JUGADOR 2
        const player2Life = this.add.text(532, 16, 'Vida Jugador 2: ');
        player2Life.setFontSize('32px'); // TAMAÑO TEXTO
        player2Life.setStroke('#000000',3); // TRAZO
        player2Life.setColor('#ff0000ff'); // COLOR

        // DEBUG UI
        // this.physics.world.createDebugGraphic();
        // this.physics.world.drawDebug = true;

        this.connectionListener = (data) => {
            if(!data.connected && this.scene.isActive()){
                this.onConnectionLost();
            }
        };
        connectionManager.addListener(this.connectionListener);
    }

    onConnectionLost(){
        this.scene.pause();
        this.scene.launch('ConnectionLostScene', {previousScene: 'GameScene'});
    }

    // FUNCIÓN QUE SIRVE PARA CONFIGURAR E INICIALIZAR LOS JUGADORES SEGÚN SELECCIÓN
    setUpPlayers() {
        // SE OBTIENEN SELECCIONES PARA CADA JUGADOR
        const pj1Seleccion = this.registry.get('jugador1'); // EJ: 'pacaC'
        const pj2Seleccion = this.registry.get('jugador2'); // EJ: 'acopC'

        // MAPEO CABEZA -> TIPO Y IDLE (CONFIGURACIÓN DE PERSONAJES)
        const personajesMap = {
            'pacaC': { tipo: 'paca', idle: 'pacaIdle1' },
            'per3C': { tipo: 'personaje3', idle: 'personaje3Idle1' },
            'acopC': { tipo: 'acop', idle: 'acopIdle1' },
            'per2C': { tipo: 'personaje2', idle: 'personaje2Idle1' }
        };

        // POSICIONES INICIALES EN EL GRID (CONVERSION A POSICIÓN DEL MUNDO)
        const posP1 = this.mapManager.fromGridToPos(1,1);
        const posP2 = this.mapManager.fromGridToPos(14,10);

        // DATOS SEGÚN MAPEO
        const datosP1 = personajesMap[pj1Seleccion];
        const datosP2 = personajesMap[pj2Seleccion];

        // CREA INSTANCIAS DE PLAYER EN ESCENA
        const jugador1 = new Player(this, 'player1', posP1.x, posP1.y, datosP1.idle, datosP1.tipo);
        const jugador2 = new Player(this, 'player2', posP2.x, posP2.y, datosP2.idle, datosP2.tipo);

        // AÑADE JUGADORES AL MAPA
        this.players.set('player1', jugador1);
        this.players.set('player2', jugador2);

        // CONFIGURACIÓN DE CONTROLES
        const InputConfig = [
            {
                // ID
                playerId: 'player1',

                // MOVIMIENTO
                upKey : 'W',
                downKey : 'S',
                leftKey: 'A',
                rightKey: 'D',

                // BOMBA
                bombKey: 'SPACE'
            },
            {
                // ID
                playerId: 'player2',

                // MOVIMIENTO
                upKey : 'UP',
                downKey : 'DOWN',
                leftKey: 'LEFT',
                rightKey: 'RIGHT',

                // BOMBA
                bombKey: 'ENTER'
            }
        ];

        // SE CREAN OBJETOS PARA LOS EVENTOS DE TECLADO
        this.inputMappings = InputConfig.map(config => {
            return {
                playerId : config.playerId,
                upKeyObj : this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[config.upKey]),
                downKeyObj: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[config.downKey]),
                leftKeyObj: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[config.leftKey]),
                rightKeyObj: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[config.rightKey]),
                bombKeyObj: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[config.bombKey]),
            }
        });
        // EVENTO DE PHASER PARA PARAR LA MÚSICA DEL JUEGO SI LA PERSONA SE SALE DE LA ESCENA GAMESCENE
        this.events.on('shutdown', () => {
             if (this.gameplayMusic) {
             this.gameplayMusic.stop(); // SE DETIENE LA MÚSICA
        }
});

 




    }

    // FUNCIÓN QUE SIRVE PARA ACTUALIZAR EL ESTADO DEL JUEGO CADA FRAME
    update() {
        // ESCAPE: PAUSA O INICIA JUEGO SEGÚN ESTADO
        if (Phaser.Input.Keyboard.JustDown(this.escapeKey)) {
            // SI NO ESTÁ PAUSADO Y EL JUEGO YA SE INICIÓ
            if (!this.isPaused && this.gameStarted) {
                this.scene.launch('MenuPause'); // LANZA ESCENA PAUSA
                this.scene.pause();             // PAUSA ESCENA ACTUAL
                this.isPaused = true;           // MARCA PAUSA
                this.gameplayMusic.pause();     // PAUSA MÚSICA
            }

            // SI EL JUEGO NO HABÍA COMENZADO, CIERRA TUTORIAL Y MARCA START
            if(!this.gameStarted){
                this.tutorial.destroy(); // ELIMINA IMAGEN TUTORIAL
                this.esctutorial.destroy(); // ELIMINA ICONO ESC
                this.gameStarted = true; // MARCA QUE HA EMPEZADO JUEGO
            }
        }

        // SI EL JUEGO ESTÁ INICIADO, PROCESA CONTROLES DE CADA JUGADOR
        if(this.gameStarted){
            this.inputMappings.forEach(mapping => {
                // SE OBTIENE LA INSTANCIA DEL JUGADOR SEGÚN MAPPING
                const player = this.players.get(mapping.playerId);
                if (player) {
                    // SE EJECUTA LA LÓGICA DE CONTROLES DEL JUGADOR (MOVIMIENTO, BOMBAS)
                    player.controls(mapping);
                }
            });
        }
    }

    // FUNCIÓN QUE SIRVE PARA CREAR TODAS LAS ANIMACIONES DE PERSONAJES Y BOMBAS
    createAnimations(){

        // PACA - ARRIBA
        this.anims.create({
            key: 'paca_walk_up',
            frames: [
                { key: 'pacaUpMove1' },
                { key: 'pacaUpMove2' },
                { key: 'pacaUpMove3' }
            ],
            frameRate: 8, // FRAME RATE
            repeat: -1    // LOOP INFINITO
        });

        // PACA - ABAJO
        this.anims.create({
            key: 'paca_walk_down',
            frames: [
                { key: 'pacaDownMove1' },
                { key: 'pacaDownMove2' },
                { key: 'pacaDownMove3' }
            ],
            frameRate: 8,
            repeat: -1
        });

        // PACA - DERECHA
        this.anims.create({
            key: 'paca_walk_right',
            frames: [
                { key: 'pacaRightMove1' },
                { key: 'pacaRightMove2' },
                { key: 'pacaRightMove3' }
            ],
            frameRate: 8,
            repeat: -1
        });

        // PACA - IZQUIERDA
        this.anims.create({
            key: 'paca_walk_left',
            frames: [
                { key: 'pacaLeftMove1' },
                { key: 'pacaLeftMove2' },
                { key: 'pacaLeftMove3' }
            ],
            frameRate: 8,
            repeat: -1
        });

        // PACA - IDLE
        this.anims.create({
            key: 'paca_idle',
            frames: [
                { key: 'pacaIdle1' },
                { key: 'pacaIdle2' }
            ],
            frameRate: 4,
            repeat: -1
        });

        // ACOP - ARRIBA
        this.anims.create({
            key: 'acop_walk_up',
            frames: [
                { key: 'acopUpMove1' },
                { key: 'acopUpMove2' },
                { key: 'acopUpMove3' }
            ],
            frameRate: 8,
            repeat: -1
        });

        // ACOP - ABAJO
        this.anims.create({
            key: 'acop_walk_down',
            frames: [
                { key: 'acopDownMove1' },
                { key: 'acopDownMove2' },
                { key: 'acopDownMove3' }
            ],
            frameRate: 8,
            repeat: -1
        });

        // ACOP - DERECHA
        this.anims.create({
            key: 'acop_walk_right',
            frames: [
                { key: 'acopRightMove1' },
                { key: 'acopRightMove2' },
                { key: 'acopRightMove3' }
            ],
            frameRate: 8,
            repeat: -1
        });

        // ACOP - IZQUIERDA
        this.anims.create({
            key: 'acop_walk_left',
            frames: [
                { key: 'acopLeftMove1' },
                { key: 'acopLeftMove2' },
                { key: 'acopLeftMove3' }
            ],
            frameRate: 8,
            repeat: -1
        });

        // ACOP - IDLE
        this.anims.create({
            key: 'acop_idle',
            frames: [
                { key: 'acopIdle1' },
                { key: 'acopIdle2' }
            ],
            frameRate: 4,
            repeat: -1
        });

        // PERSONAJE 2 - ARRIBA
        this.anims.create({
            key: 'personaje2_walk_up',
            frames: [
                { key: 'personaje2UpMove1' },
                { key: 'personaje2UpMove2' },
                { key: 'personaje2UpMove3' }
            ],
            frameRate: 8,
            repeat: -1
        });

        // PERSONAJE 2 - ABAJO
        this.anims.create({
            key: 'personaje2_walk_down',
            frames: [
                { key: 'personaje2DownMove1' },
                { key: 'personaje2DownMove2' },
                { key: 'personaje2DownMove3' }
            ],
            frameRate: 8,
            repeat: -1
        });

        // PERSONAJE 2 - DERECHA
        this.anims.create({
            key: 'personaje2_walk_right',
            frames: [
                { key: 'personaje2RightMove1' },
                { key: 'personaje2RightMove2' },
                { key: 'personaje2RightMove3' }
            ],
            frameRate: 8,
            repeat: -1
        });

        // PERSONAJE 2 - IZQUIERDA
        this.anims.create({
            key: 'personaje2_walk_left',
            frames: [
                { key: 'personaje2LeftMove1' },
                { key: 'personaje2LeftMove2' },
                { key: 'personaje2LeftMove3' }
            ],
            frameRate: 8,
            repeat: -1
        });

        // PERSONAJE 2 - IDLE
        this.anims.create({
            key: 'personaje2_idle',
            frames: [
                { key: 'personaje2Idle1' },
                { key: 'personaje2Idle2' }
            ],
            frameRate: 4,
            repeat: -1
        });

        // PERSONAJE 3 - ARRIBA
        this.anims.create({
            key: 'personaje3_walk_up',
            frames: [
                { key: 'personaje3UpMove1' },
                { key: 'personaje3UpMove2' },
                { key: 'personaje3UpMove3' }
            ],
            frameRate: 8,
            repeat: -1
        });

        // PERSONAJE 3 - ABAJO
        this.anims.create({
            key: 'personaje3_walk_down',
            frames: [
                { key: 'personaje3DownMove1' },
                { key: 'personaje3DownMove2' },
                { key: 'personaje3DownMove3' }
            ],
            frameRate: 8,
            repeat: -1
        });

        // PERSONAJE 3 - DERECHA
        this.anims.create({
            key: 'personaje3_walk_right',
            frames: [
                { key: 'personaje3RightMove1' },
                { key: 'personaje3RightMove2' },
                { key: 'personaje3RightMove3' }
            ],
            frameRate: 8,
            repeat: -1
        });

        // PERSONAJE 3 - IZQUIERDA
        this.anims.create({
            key: 'personaje3_walk_left',
            frames: [
                { key: 'personaje3LeftMove1' },
                { key: 'personaje3LeftMove2' },
                { key: 'personaje3LeftMove3' }
            ],
            frameRate: 8,
            repeat: -1
        });

        // PERSONAJE 3 - IDLE
        this.anims.create({
            key: 'personaje3_idle',
            frames: [
                { key: 'personaje3Idle1' },
                { key: 'personaje3Idle2' }
            ],
            frameRate: 4,
            repeat: -1
        });

        // BOMBAS - ANIMACIÓN PREPARACIÓN (PARPADEO)
        this.anims.create({
            key: 'prepBomb',
            frames: [
                { key: 'bomb1' },
                { key: 'bomb2' }
            ],
            frameRate: 8,
            repeat: -1
        });

        // BOMBAS - ANIMACIÓN EXPLOSIÓN (SE EJECUTA UNA VEZ Y SE OCULTA AL COMPLETAR)
        this.anims.create({
            key: 'explosionBomb',
            frames: [
                { key: 'explosion1' },
                { key: 'explosion2' },
                { key: 'explosion3' },
                { key: 'explosion4' },
                { key: 'explosion5' },
                { key: 'explosion6' }
            ],
            frameRate: 12,
            repeat: 0,
            hideOnComplete: true // SE OCULTA EL SPRITE AL COMPLETAR ANIMACIÓN
        });
    }
}