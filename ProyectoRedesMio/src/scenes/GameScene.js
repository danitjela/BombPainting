import Phaser from 'phaser';
import { Player } from '../entities/Player';
import { Bomb } from '../entities/Bomb';

import { MapManager } from '../map/MapManager';
import { DestructibleWall } from '../map/DestructibleWall';

export class GameScene extends Phaser.Scene {

    constructor() {
        super('GameScene');
    }

    init() {
        this.players = new Map();
        this.inputMappings = [];
        this.isPaused = false;
    }

    preload() {
        //Suelo
        this.load.image('floor1', 'assets/spritesFondo/Sprites_cesped/C_1.png');
        this.load.image('floor2', 'assets/spritesFondo/Sprites_cesped/C_2.png');

        this.load.image('floor1G', 'assets/spritesFondo/Sprites_cesped/GC_1.png');
        this.load.image('floor2G', 'assets/spritesFondo/Sprites_cesped/GC_2.png');

        //Muros laterales
        //Esquinas
        this.load.image('LTCorner', 'assets/spritesFondo/Sprites_muros/M_EsqSI.png');
        this.load.image('RTCorner', 'assets/spritesFondo/Sprites_muros/M_EsqSD.png');
        this.load.image('LBCorner', 'assets/spritesFondo/Sprites_muros/M_EsqII.png');
        this.load.image('RBCorner', 'assets/spritesFondo/Sprites_muros/M_EsqID.png');

        //Bordes
        this.load.image('LBorder', 'assets/spritesFondo/Sprites_muros/M_LatI.png');
        this.load.image('RBorder', 'assets/spritesFondo/Sprites_muros/M_LatD.png');
        this.load.image('TBorder', 'assets/spritesFondo/Sprites_muros/M_Sup.png');
        this.load.image('BBorder', 'assets/spritesFondo/Sprites_muros/M_Inf.png');

        //Columnas
        //Izquierda
        this.load.image('LColumn1', 'assets/spritesFondo/Sprites_muros/M_LatEsp3.png');
        this.load.image('LColumn2', 'assets/spritesFondo/Sprites_muros/M_LatEsp4.png');

        //Derecha
        this.load.image('RColumn1', 'assets/spritesFondo/Sprites_muros/M_LatEsp1.png');
        this.load.image('RColumn2', 'assets/spritesFondo/Sprites_muros/M_LatEsp2.png');

        //Superior
        this.load.image('TColumn1', 'assets/spritesFondo/Sprites_muros/M_EspSup1.png');
        this.load.image('TColumn2', 'assets/spritesFondo/Sprites_muros/M_EspSup2.png');

        //Inferior
        this.load.image('BColumn1', 'assets/spritesFondo/Sprites_muros/M_EspSup3.png');
        this.load.image('BColumn2', 'assets/spritesFondo/Sprites_muros/M_EspSup4.png');

        //Arbustos irrompibles
        //this.load.image('Bush1', 'assets/spritesFondo/Sprites_otros/Muro_color002');
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

        //Caja destructible
        this.load.image('Box', 'assets/spritesFondo/Sprites_otros/Caja.png')


        //Personajes
        //Paca
        //Movimiento
        //Arriba
        this.load.image('pacaUpMove1', 'assets/personajes/sprites_Paca/PacaColor/walk/Paca_At1.png');
        this.load.image('pacaUpMove2', 'assets/personajes/sprites_Paca/PacaColor/walk/Paca_At2.png');
        this.load.image('pacaUpMove3', 'assets/personajes/sprites_Paca/PacaColor/walk/Paca_At2.png');

        //Abajo
        this.load.image('pacaDownMove1', 'assets/personajes/sprites_Paca/PacaColor/walk/Paca_Arr1.png');
        this.load.image('pacaDownMove2', 'assets/personajes/sprites_Paca/PacaColor/walk/Paca_Arr2.png');
        this.load.image('pacaDownMove3', 'assets/personajes/sprites_Paca/PacaColor/walk/Paca_Arr2.png');
        
        //Derecha
        this.load.image('pacaRightMove1', 'assets/personajes/sprites_Paca/PacaColor/walk/Paca_Dch1.png');
        this.load.image('pacaRightMove2', 'assets/personajes/sprites_Paca/PacaColor/walk/Paca_Dch2.png');
        this.load.image('pacaRightMove3', 'assets/personajes/sprites_Paca/PacaColor/walk/Paca_Dch3.png');

        //Izquierda
        this.load.image('pacaLeftMove1', 'assets/personajes/sprites_Paca/PacaColor/walk/Paca_Izq1.png');
        this.load.image('pacaLeftMove2', 'assets/personajes/sprites_Paca/PacaColor/walk/Paca_Izq2.png');
        this.load.image('pacaLeftMove3', 'assets/personajes/sprites_Paca/PacaColor/walk/Paca_Izq3.png');

        //Idle
        this.load.image('pacaIdle1', 'assets/personajes/sprites_Paca/PacaColor/idle/PacaArrA.png');
        this.load.image('pacaIdle2', 'assets/personajes/sprites_Paca/PacaColor/idle/PacaArrB.png');
    

        //Acop
        //Movimiento
        //Arriba
        this.load.image('acopUpMove1', 'assets/personajes/sprites_Acop/Gris/walk/atras/acopGrisDerecha.png');
        this.load.image('acopUpMove2', 'assets/personajes/sprites_Acop/Gris/walk/atras/acopGrisMedio.png');
        this.load.image('acopUpMove3', 'assets/personajes/sprites_Acop/Gris/walk/atras/acopGrisIzquierda.png');

        //Abajo
        this.load.image('acopDownMove1', 'assets/personajes/sprites_Acop/Gris/walk/frente/acopGrisDerecha.png');
        this.load.image('acopDownMove2', 'assets/personajes/sprites_Acop/Gris/walk/frente/acopGrisMedio.png');
        this.load.image('acopDownMove3', 'assets/personajes/sprites_Acop/Gris/walk/frente/acopGrisIzquierda.png');
        
        //Derecha
        this.load.image('acopRightMove1', 'assets/personajes/sprites_Acop/Gris/walk/derecha/acopGrisAndar1.png');
        this.load.image('acopRightMove2', 'assets/personajes/sprites_Acop/Gris/walk/derecha/acopGrisAndarMedio.png');
        this.load.image('acopRightMove3', 'assets/personajes/sprites_Acop/Gris/walk/derecha/acopGrisAndar2.png');

        //Izquierda
        this.load.image('acopLeftMove1', 'assets/personajes/sprites_Acop/Gris/walk/izquierda/acopGrisAndar1.png');
        this.load.image('acopLeftMove2', 'assets/personajes/sprites_Acop/Gris/walk/izquierda/acopGrisAndarMedio.png');
        this.load.image('acopLeftMove3', 'assets/personajes/sprites_Acop/Gris/walk/izquierda/acopGrisAndar2.png');

        //Idle
        this.load.image('acopIdle1', 'assets/personajes/sprites_Acop/Gris/idle/frente/acopGrisAbajo.png');
        this.load.image('acopIdle2', 'assets/personajes/sprites_Acop/Gris/idle/frente/acopGrisArriba.png');
    
        //Personaje2
        //Movimiento
         //Arriba
        this.load.image('personaje2UpMove1', 'assets/personajes/sprites_personaje2/Gris/walk/atras/personaje2GrisDerecha.png');
        this.load.image('personaje2UpMove2', 'assets/personajes/sprites_personaje2/Gris/walk/atras/personaje2GrisMedio.png');
        this.load.image('personaje2UpMove3', 'assets/personajes/sprites_personaje2/Gris/walk/atras/personaje2GrisIzquierda.png');

        //Abajo
        this.load.image('personaje2DownMove1', 'assets/personajes/sprites_personaje2/Gris/walk/frente/personaje2GrisDerecha.png');
        this.load.image('personaje2DownMove2', 'assets/personajes/sprites_personaje2/Gris/walk/frente/personaje2GrisMedio.png');
        this.load.image('personaje2DownMove3', 'assets/personajes/sprites_personaje2/Gris/walk/frente/personaje2GrisIzquierda.png');
        
        //Derecha
        this.load.image('personaje2RightMove1', 'assets/personajes/sprites_personaje2/Gris/walk/derecha/personaje2GrisAndar1.png');
        this.load.image('personaje2RightMove2', 'assets/personajes/sprites_personaje2/Gris/walk/derecha/personaje2GrisAndarMedio.png');
        this.load.image('personaje2RightMove3', 'assets/personajes/sprites_personaje2/Gris/walk/derecha/personaje2GrisAndar2.png');

        //Izquierda
        this.load.image('personaje2LeftMove1', 'assets/personajes/sprites_personaje2/Gris/walk/izquierda/personaje2GrisAndar1.png');
        this.load.image('personaje2LeftMove2', 'assets/personajes/sprites_personaje2/Gris/walk/izquierda/personaje2GrisAndarMedio.png');
        this.load.image('personaje2LeftMove3', 'assets/personajes/sprites_personaje2/Gris/walk/izquierda/personaje2GrisAndar2.png');

        //Idle
        this.load.image('personaje2Idle1', 'assets/personajes/sprites_personaje2/Gris/idle/frente/personaje2GrisArriba.png');
        this.load.image('personaje2Idle2', 'assets/personajes/sprites_personaje2/Gris/idle/frente/personaje2GrisAbajo.png');

        //Personaje3
        //Movimiento
         //Arriba
        this.load.image('personaje3UpMove1', 'assets/personajes/sprites_personaje3/ChicoColor/Walk/Chico_At1.png');
        this.load.image('personaje3UpMove2', 'assets/personajes/sprites_personaje3/ChicoColor/Walk/Chico_At2.png');
        this.load.image('personaje3UpMove3', 'assets/personajes/sprites_personaje3/ChicoColor/Walk/Chico_At3.png');

        //Abajo
        this.load.image('personaje3DownMove1', 'assets/personajes/sprites_personaje3/ChicoColor/Walk/Chico_Arr1.png');
        this.load.image('personaje3DownMove2', 'assets/personajes/sprites_personaje3/ChicoColor/Walk/Chico_Arr2.png');
        this.load.image('personaje3DownMove3', 'assets/personajes/sprites_personaje3/ChicoColor/Walk/Chico_Arr3.png');
        
        //Derecha
        this.load.image('personaje3RightMove1', 'assets/personajes/sprites_personaje3/ChicoColor/Walk/Chico_Dch1.png');
        this.load.image('personaje3RightMove2', 'assets/personajes/sprites_personaje3/ChicoColor/Walk/Chico_Dch2.png');
        this.load.image('personaje3RightMove3', 'assets/personajes/sprites_personaje3/ChicoColor/Walk/Chico_Dch3.png');

        //Izquierda
        this.load.image('personaje3LeftMove1', 'assets/personajes/sprites_personaje3/ChicoColor/Walk/Chico_Izq1.png');
        this.load.image('personaje3LeftMove2', 'assets/personajes/sprites_personaje3/ChicoColor/Walk/Chico_Izq2.png');
        this.load.image('personaje3LeftMove3', 'assets/personajes/sprites_personaje3/ChicoColor/Walk/Chico_Izq3.png');

        //Idle
        this.load.image('personaje3Idle1', 'assets/personajes/sprites_personaje3/ChicoColor/Idle/ChicoArrA.png');
        this.load.image('personaje3Idle2', 'assets/personajes/sprites_personaje3/ChicoColor/Idle/ChicoArrB.png');


        //Bombas
        //Parpadeo
        this.load.image('bomb1', 'assets/bombas/animacion2/animacion1Grande.png');
        this.load.image('bomb2', 'assets/bombas/animacion2/animacion2Grande.png');

        //Explosion
        this.load.image('explosion1', 'assets/bombas/explosion/explosion1.png');
        this.load.image('explosion2', 'assets/bombas/explosion/explosion2.png');
        this.load.image('explosion3', 'assets/bombas/explosion/explosion3.png');
        this.load.image('explosion4', 'assets/bombas/explosion/explosion4.png');
        this.load.image('explosion5', 'assets/bombas/explosion/explosion5.png');
        this.load.image('explosion6', 'assets/bombas/explosion/explosion6.png');

        //Manchas
        this.load.image('stain1', 'assets/manchas/manchaAmarilla.png');
        this.load.image('decolored_stain1', 'assets/manchas/manchaAmarillaGris.png');
        this.load.image('stain2', 'assets/manchas/manchaNaranja.png');
        this.load.image('decolored_stain2', 'assets/manchas/manchaNaranjaGris.png');
        this.load.image('stain3', 'assets/manchas/manchaRoja.png');
        this.load.image('decolored_stain3', 'assets/manchas/manchaRojaGris.png');

        //Corazones
        this.load.image('heart', 'assets/spriteCorazones/corazonColor.png');
        this.load.image('emptyHeart', 'assets/spriteCorazones/corazonVacio.png');

        //PowerUps
        this.load.image('boostMoreBombs', 'assets/boost/boostBombas.png');
        this.load.image('boostBiggerExplosion', 'assets/boost/boostExplosionGrande.png');
        this.load.image('boostFasterExplosion', 'assets/boost/boostExploxionRapida.png');
        this.load.image('boostMoreLife', 'assets/boost/boostVida.png');

        this.load.audio('gameMusic', 'assets/efectosDeSonido/musicaGamePlay.mp3');
        this.load.audio('explosion', 'assets/efectosDeSonido/explosion2.mp3');
        this.load.audio('loseLife', 'assets/efectosDeSonido/perderVida.mp3');
        this.load.audio('bomb', 'assets/efectosDeSonido/ponerBomba.mp3');
        this.load.audio('specialBomb', 'assets/efectosDeSonido/ponerBombaEspecial.mp3');
        this.load.audio('powerUp', 'assets/efectosDeSonido/powerUp.mp3');
    }

    create() {
        this.gameplayMusic = this.sound.add('gameMusic', { loop: true, volume: 0.1 });
        this.gameplayMusic.play();

        this.mapManager = new MapManager(this);
        this.mapManager.createMap();

        this.escapeKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

        this.createAnimations();
        this.setUpPlayers();

        this.events.on('resume', () => {
            this.isPaused = false;
            this.gameplayMusic.resume();
        });
        
        this.players.forEach(player => {
            this.physics.add.collider(player.sprite, this.mapManager.exteriorWalls);
            this.physics.add.collider(player.sprite, this.mapManager.interiorWalls);
            this.mapManager.destructibleWalls.forEach(wall => {
                this.physics.add.collider(player.sprite, wall.sprite);
            });
        });

        const player1Life = this.add.text(20, 16, 'Vida Jugador 1: ');
        player1Life.setFontSize('32px');
        player1Life.setStroke('#000000',3);
        player1Life.setColor('#ff0000ff');

        const player2Life = this.add.text(532, 16, 'Vida Jugador 2: ');
        player2Life.setFontSize('32px');
        player2Life.setStroke('#000000',3);
        player2Life.setColor('#ff0000ff');

        this.physics.world.createDebugGraphic();
        this.physics.world.drawDebug = true;
    }

    setUpPlayers() {
        // Recuperar personajes seleccionados en CharacterSelectScene
        const pj1Seleccion = this.registry.get('jugador1'); // ej: 'pacaC'
        const pj2Seleccion = this.registry.get('jugador2'); // ej: 'acopC'

        // Mapeo cabeza -> tipo de personaje y animación idle
        const personajesMap = {
            'pacaC': { tipo: 'paca', idle: 'pacaIdle1' },
            'per3C': { tipo: 'personaje3', idle: 'personaje3Idle1' },
            'acopC': { tipo: 'acop', idle: 'acopIdle1' },
            'per2C': { tipo: 'personaje2', idle: 'personaje2Idle1' }
        };

        const posP1 = this.mapManager.fromGridToPos(1,1);
        const posP2 = this.mapManager.fromGridToPos(14,10);

        const datosP1 = personajesMap[pj1Seleccion];
        const datosP2 = personajesMap[pj2Seleccion];

        const jugador1 = new Player(this, 'player1', posP1.x, posP1.y, datosP1.idle, datosP1.tipo);
        const jugador2 = new Player(this, 'player2', posP2.x, posP2.y, datosP2.idle, datosP2.tipo);

        this.players.set('player1', jugador1);
        this.players.set('player2', jugador2);

        // Configuración de controles
        const InputConfig = [
            {
                playerId: 'player1',
                upKey : 'W',
                downKey : 'S',
                leftKey: 'A',
                rightKey: 'D',
                bombKey: 'SPACE'
            },
            {
                playerId: 'player2',
                upKey : 'UP',
                downKey : 'DOWN',
                leftKey: 'LEFT',
                rightKey: 'RIGHT',
                bombKey: 'ENTER'
            }
        ];
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
    }

    update() {

        if (Phaser.Input.Keyboard.JustDown(this.escapeKey)) {
            if (!this.isPaused) {
                this.scene.launch('MenuPause');
                this.scene.pause();
                this.isPaused = true;
                this.gameplayMusic.pause();
            }
        }

        this.inputMappings.forEach(mapping => {
            const player = this.players.get(mapping.playerId);
            if (player) {
                player.controls(mapping);
            }
        });

    }

    createAnimations(){

        //Paca
        this.anims.create({
            key: 'paca_walk_up',
            frames: [
                { key: 'pacaUpMove1' },
                { key: 'pacaUpMove2' },
                { key: 'pacaUpMove3' }
            ],
            frameRate: 8,
            repeat: -1
        });

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

        this.anims.create({
            key: 'paca_idle',
            frames: [
                { key: 'pacaIdle1' },
                { key: 'pacaIdle2' }
            ],
            frameRate: 4,
            repeat: -1
        });


        //Acop

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

        this.anims.create({
            key: 'acop_idle',
            frames: [
                { key: 'acopIdle1' },
                { key: 'acopIdle2' }
            ],
            frameRate: 4,
            repeat: -1
        });

        //Personaje 2

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

        this.anims.create({
            key: 'personaje2_idle',
            frames: [
                { key: 'personaje2Idle1' },
                { key: 'personaje2Idle2' }
            ],
            frameRate: 4,
            repeat: -1
        });

        //Personaje 3

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

        this.anims.create({
            key: 'personaje3_idle',
            frames: [
                { key: 'personaje3Idle1' },
                { key: 'personaje3Idle2' }
            ],
            frameRate: 4,
            repeat: -1
        });
    


        //Bombas
        this.anims.create({
            key: 'prepBomb',
            frames: [
                { key: 'bomb1' },
                { key: 'bomb2' }
            ],
            frameRate: 8,
            repeat: -1
        });

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
            hideOnComplete: true
        });
    }
    

    
}