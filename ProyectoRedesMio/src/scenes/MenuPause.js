import Phaser from 'phaser';


export class MenuPause extends Phaser.Scene {
    constructor() {
        super('MenuPause');
    }

    create() {
        this.add.text(400, 100, 'PONG GAME', {
            fontSize: '64px',
            color: '#ffffff'
        }).setOrigin(0.5);

        //Botón reaunudar
        const resumeBtn = this.add.text(400, 300, 'Reanudar', {
            fontSize: '24px',
            color: '#00ff00',
        }).setOrigin(0.5)
        .setInteractive({useHandCursor: true});
        resumeBtn.on('pointerover',() => resumeBtn.setColor('#00ff88'))
        .on('pointerout', () => localBtn.setColor('#00ff00'))
        .on('pointerdown', () => {
            this.scene.stop();
            this.scene.resume('GameScene');
        });

        const localBtn = this.add.text(400, 320, 'Local 2 Player', {
            fontSize: '24px',
            color: '#00ff00',
        }).setOrigin(0.5)
        .setInteractive({useHandCursor: true})
        .on('pointerover', () => localBtn.setColor('#00ff88'))
        .on('pointerout', () => localBtn.setColor('#00ff00'))
        .on('pointerdown', () => {
            this.scene.start('GameScene');
        });

        const onlineBtn = this.add.text(400, 390, 'Online Multiplayer (Not available)', {
            fontSize: '24px',
            color: '#ff6666',
        }).setOrigin(0.5);
    }
}
