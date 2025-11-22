import Phaser from 'phaser';
import { MenuScene } from './MenuScene';


export class MenuCredits extends Phaser.Scene {
    constructor() {
        super('MenuCredits');
    }

    create() {
        this.add.text(512, 100, 'Juego hecho por:', {
            fontSize: '64px',
            color: '#ffffff'
        }).setOrigin(0.5);

        this.add.text(512, 200, 'Ester Díaz Monzonis',{
            fontSize: '42px',
            color: '#ffffff'
        }).setOrigin(0.5);

        this.add.text(512, 300, 'Aroa Quiroga Martínez',{
            fontSize: '42px',
            color: '#ffffff'
        }).setOrigin(0.5);

        this.add.text(512, 400, 'Sandra Saez Piña',{
            fontSize: '42px',
            color: '#ffffff'
        }).setOrigin(0.5);

        this.add.text(512, 500, 'Daniela Tocino Jiménez',{
            fontSize: '42px',
            color: '#ffffff'
        }).setOrigin(0.5);

        this.add.text(512, 600, 'Raúl Benítez Tiburón',{
            fontSize: '42px',
            color: '#ffffff'
        }).setOrigin(0.5);

        const volverBtn = this.add.text(100, 700, 'Volver',{
            fontSize: '32px',
            color: '#ffffff'
        }).setInteractive({ useHandCursor: true });
        volverBtn.on('pointerover', () => {
            volverBtn.setColor('#00ff00')
        })
        volverBtn.on('pointerout', () => {
            volverBtn.setColor('#ffffff')
        })
        volverBtn.on('pointerdown', () => {
            console.log('Return Menu');
            this.scene.start('MenuScene');
        })
    }
}