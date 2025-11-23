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
        

        //this.physics.add.collider(player.sprite, this.mapManager.exteriorWalls);
    }

    setUpPlayers() {
        const paca = new Player(this, 'player1', 50, 300);
        const acop = new Player(this, 'player2', 750, 300, 'acopIdle1'); 

        this.players.set('player1', paca);
        this.players.set('player2', acop);

        const InputConfig = [
            {
                playerId: 'player1',
                upKey : 'W',
                downKey : 'S',
                leftKey: 'A',
                rightKey: 'D',
                bombKey: 'ESPACE'
            },
            {
                playerId: 'player2',
                upKey : 'UP',
                downKey : 'DOWN',
                leftKey: 'LEFT',
                rightKey: 'RIGHT',
                bombKey: 'NUMPAD_ZERO'
            }
        ]
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
    }
}