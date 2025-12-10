// MÓDULOS: IMPORTA PHASER Y TODAS LAS ESCENAS DEL JUEGO
import Phaser from 'phaser';
import { ComicScene } from './scenes/ComicScene.js';
import { MenuScene } from './scenes/MenuScene.js';
import { CharacterSelectScene } from './scenes/CharacterSelectScene.js';
import { GameScene } from './scenes/GameScene.js';
import { MenuPause } from './scenes/MenuPause.js';
import { MenuCredits } from './scenes/MenuCredits.js';
import { Player1VictoryScene } from './scenes/Player1VictoryScene.js';
import { Player2VictoryScene } from './scenes/Player2VictoryScene.js';
import { ConnectionLostScene } from './scenes/ConnectionLostScene.js';

// OBJETO QUE SIRVE PARA CONFIGURAR LA INSTANCIA DE PHASER
const config = {
    type: Phaser.AUTO,                    // CONFIGURA RENDERING AUTOMÁTICO (CANVAS/WEBGL)
    width: 1024,                          // ANCHO DEL JUEGO
    height: 768,                          // ALTO DEL JUEGO
    parent: 'game-container',             // CONTENEDOR HTML DONDE SE INYECTA EL CANVAS
    physics: {                            // CONFIGURACIÓN DEL SISTEMA FÍSICO
        default: 'arcade',                // MOTOR FÍSICO POR DEFECTO
        arcade: {
            gravity: { x: 0, y: 0 },     // GRAVEDAD GLOBAL (SIN GRAVEDAD)
            debug: false                  // MODO DEBUG DESACTIVADO
        }
    },
    scene: [                              // ARRAY DE ESCENAS QUE COMPONEN EL JUEGO
        ComicScene,
        MenuScene,
        CharacterSelectScene,
        GameScene,
        MenuPause,
        MenuCredits,
        Player1VictoryScene,
        Player2VictoryScene,
        ConnectionLostScene
    ],
    backgroundColor: '#1a1a2e',           // COLOR DE FONDO POR DEFECTO
}

// CREA LA INSTANCIA PRINCIPAL DEL JUEGO CON LA CONFIGURACIÓN ANTERIOR
const game = new Phaser.Game(config); // CREA JUEGO Y INICIA EL BUCLE PRINCIPAL