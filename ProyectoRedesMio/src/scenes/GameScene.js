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
        this.escWasDown = false;
    }

    preload() {
        //Suelo
        this.load.image('floor1', 'assets/spritesFondo/Sprites_cesped/C_1.png');
        this.load.image('floor2', 'assets/spritesFondo/Sprites_cesped/C_2.png');

        //Muros laterales
        //Esquinas
        this.load.image('LTCorner', 'assets/spritesFondo/Sprites_muros/M_EsqSI.png')
        this.load.image('RTCorner', 'assets/spritesFondo/Sprites_muros/M_EsqSD.png')
        this.load.image('LBCorner', 'assets/spritesFondo/Sprites_muros/M_EsqII.png')
        this.load.image('RBCorner', 'assets/spritesFondo/Sprites_muros/M_EsqID.png')

        //Bordes
        this.load.image('LBorder', 'assets/spritesFondo/Sprites_muros/M_LatI.png')
        this.load.image('RBorder', 'assets/spritesFondo/Sprites_muros/M_LatD.png')
        this.load.image('TBorder', 'assets/spritesFondo/Sprites_muros/M_Sup.png')
        this.load.image('BBorder', 'assets/spritesFondo/Sprites_muros/M_Inf.png')

        //Columnas
        //Izquierda
        this.load.image('LColumn1', 'assets/spritesFondo/Sprites_muros/M_LatEsp3.png')
        this.load.image('LColumn2', 'assets/spritesFondo/Sprites_muros/M_LatEsp4.png')

        //Derecha
        this.load.image('RColumn1', 'assets/spritesFondo/Sprites_muros/M_LatEsp1.png')
        this.load.image('RColumn2', 'assets/spritesFondo/Sprites_muros/M_LatEsp2.png')

        //Superior
        this.load.image('TColumn1', 'assets/spritesFondo/Sprites_muros/M_EspSup1.png')
        this.load.image('TColumn2', 'assets/spritesFondo/Sprites_muros/M_EspSup2.png')

        //Inferior
        this.load.image('BColumn1', 'assets/spritesFondo/Sprites_muros/M_EspSup3.png')
        this.load.image('BColumn2', 'assets/spritesFondo/Sprites_muros/M_EspSup4.png')

    }

    create() {
        this.mapManager = new MapManager(this);
        this.mapManager.createMap();

        //this.physics.add.collider(player.sprite, this.mapManager.exteriorWalls);
    }

    /*setUpPlayers() {
        const paca = new Player(this, 'player1', 50, 300);
        const acop = new Player(this, 'player2', 750, 300); 

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
    }*/

    update() {
    }
}