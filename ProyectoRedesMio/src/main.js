import Phaser from 'phaser';
import { ComicScene } from './scenes/ComicScene.js';
import { MenuScene } from './scenes/MenuScene.js';
import { GameScene } from './scenes/GameScene.js';
import { MenuPause } from './scenes/MenuPause.js';
import { MenuCredits } from './scenes/MenuCredits.js';

const config = {
    type: Phaser.AUTO,
    width: 1024,
    height: 768,
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x:0, y: 0 },
            debug: false
        }
    },
    scene: [ComicScene, MenuScene, GameScene, MenuPause, MenuCredits],
    backgroundColor: '#1a1a2e',
}

const game = new Phaser.Game(config);