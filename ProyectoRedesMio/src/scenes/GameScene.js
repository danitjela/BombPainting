import Phaser from 'phaser';
import { Player } from '../entities/Player';
import { Bomb } from '../entities/Bomb';

import { MapManager } from '../map/MapManager';

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
    }

    create() {
        this.mapManager = new MapManager(this);
        this.mapManager.createMap();

        this.escapeKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

        this.createAnimations();
        this.setUpPlayers();

        this.events.on('resume', () => {
            this.isPaused = false;
        });
        
        this.players.forEach(player => {
            this.physics.add.collider(player.sprite, this.mapManager.exteriorWalls);
        });
    }

    setUpPlayers() {
        // Recuperar personajes seleccionados en CharacterSelectScene
        const pj1Seleccion = this.registry.get('jugador1'); // ej: 'pacaC'
        const pj2Seleccion = this.registry.get('jugador2'); // ej: 'acopC'

        // Mapeo cabeza -> tipo de personaje y animación idle
        const personajesMap = {
            'pacaC': { tipo: 'paca', idle: 'pacaIdle1' },
            'per3C': { tipo: 'per3', idle: 'per3Idle1' }, // debes agregar sprites/animaciones de per3
            'acopC': { tipo: 'acop', idle: 'acopIdle1' },
            'per2C': { tipo: 'personaje2', idle: 'personaje2Idle1' } // debes agregar sprites/animaciones de per2
        };

        const posP1 = this.mapManager.fromGridToPos(1,1);
        const posP2 = this.mapManager.fromGridToPos(14,10);

        // Crear jugadores dinámicamente según selección
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
                bombKey: 'NUMPAD_ZERO'
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
            }
        }

        this.inputMappings.forEach(mapping => {
            const player = this.players.get(mapping.playerId);
            if (player) {
                player.move(mapping);
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
    
    }
    

    
}