import Phaser from 'phaser';
import { connectionManager } from '../services/ConnectionManager';

/**
 * Escena que se muestra cuando se pierde la conexión con el servidor
 * Pausa el resto de escenas y comprueba continuamente hasta que se restablezca
 */
export class ConnectionLostScene extends Phaser.Scene {
    constructor() {
        super('ConnectionLostScene');
        this.reconnectCheckInterval = null;
    }

    init(data) {
        // Guardar la escena que estaba activa cuando se perdió la conexión
        this.previousScene = data.previousScene;
    }

    create() {
        this.add.rectangle(512, 378, 800, 600, 0x000000, 0.8);

        // Título
        this.add.text(512, 200, 'CONEXIÓN PERDIDA', {
            fontFamily: 'PixelFont',
            fontSize: '60px',
            color: '#ff0000',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Mensaje
        this.statusText = this.add.text(512, 350, 'Intentando reconectar...', {
            fontFamily: 'PixelFont',
            fontSize: '32px',
            color: '#ffff00'
        }).setOrigin(0.5);

        // Contador de intentos
        this.attemptCount = 0;
        this.attemptText = this.add.text(512, 450, 'Intentos: 0', {
            fontFamily: 'PixelFont',
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5);

        this.returnBtn = this.add.text(512, 550, 'Volver al menú', {
            fontFamily: 'PixelFont',
            fontSize: '48px',
            color: '#00ff00'
        }).setInteractive({ useHandCursor: true })
        this.returnBtn.setOrigin(0.5);
        this.returnBtn.visible = false;

        this.returnBtn.on('pointerover', () => {
            // CAMBIA TEXTURA A ESTADO HOVER
            this.returnBtn.setColor('#195706ff');
        })

        this.returnBtn.on('pointerout', () => {
            // RESTAURA TEXTURA NORMAL DEL BOTÓN
            this.returnBtn.setColor('#00ff00');
        })

        this.returnBtn.on('pointerdown', () => {
            // LOG PARA INDICAR RETORNO AL MENÚ
            console.log('BACK To Menu');
            // SE DETIENE LA ESCENA DE PAUSA
            this.scene.stop();
            // SE DETIENE LA ESCENA DEL JUEGO (POR SI ESTÁ ACTIVA)
            this.scene.stop('GameScene');
            // SE INICIA LA ESCENA PRINCIPAL DEL MENÚ
            this.scene.start('MenuScene');
        })


        // Indicador parpadeante
        this.dotCount = 0;
        this.time.addEvent({
            delay: 2000,
            callback: () => {
                this.dotCount = (this.dotCount + 1) % 4;
                const dots = '.'.repeat(this.dotCount);
                this.statusText.setText(`Intentando reconectar${dots}`);
            },
            loop: true
        });

        // Listener para cambios de conexión
        this.connectionListener = (data) => {
            if (data.connected) {
                this.onReconnected();
            }
        };
        connectionManager.addListener(this.connectionListener);

        // Intentar reconectar cada 2 segundos
        this.reconnectCheckInterval = setInterval(() => {
            this.attemptReconnect();
        }, 2000);

        // Primer intento inmediato
        this.attemptReconnect();
    }

    async attemptReconnect() {
        this.attemptCount++;
        this.attemptText.setText(`Intentos: ${this.attemptCount}`);
        await connectionManager.checkConnection();
        if(this.attemptCount == 15){
            this.returnBtn.visible = true;
        }
    }

    onReconnected() {
        // Limpiar interval
        if (this.reconnectCheckInterval) {
            clearInterval(this.reconnectCheckInterval);
        }

        // Remover listener
        connectionManager.removeListener(this.connectionListener);

        // Mensaje de éxito
        this.statusText.setText('¡Conexión restablecida!');
        this.statusText.setColor('#00ff00');

        // Volver a la escena anterior
        this.time.delayedCall(1000, () => {
            this.scene.stop();
            if (this.previousScene) {
                this.scene.resume(this.previousScene);
            }
        });
    }

    shutdown() {
        // Limpiar el interval al cerrar la escena
        if (this.reconnectCheckInterval) {
            clearInterval(this.reconnectCheckInterval);
        }
        // Remover el listener
        if (this.connectionListener) {
            connectionManager.removeListener(this.connectionListener);
        }
    }
}
