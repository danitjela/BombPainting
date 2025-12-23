import Phaser from 'phaser';

export class LoginScene extends Phaser.Scene {

    constructor() {
        super('LoginScene');
    }

    preload(){
        this.load.image('backgroundLogin', 'assets/MenuPausa/ManchaPausa.png');

        // CARGA EFECTOS DE SONIDO PARA INTERACCIÓN CON BOTONES
        this.load.audio('button', 'assets/efectosDeSonido/boton.mp3');
        this.load.audio('buttonClick', 'assets/efectosDeSonido/botonClick.mp3');
    }

    create(){
        this.add.image(512, 378, 'backgroundLogin').setOrigin(0.5);

        this.add.text(512, 250, 'Identificación',{
            fontFamily: 'PixelFont',
            fontSize: '80px',
            color:'#ff0000'
        }).setOrigin(0.5);

        this.emailInput = document.createElement('input'); 
        this.emailInput.type = 'email'; 
        this.emailInput.placeholder = 'Introduce tu email'; 
        this.emailInput.style.position = 'absolute'; 
        this.emailInput.style.top = '375px'; 
        this.emailInput.style.left = '800px'; 
        this.emailInput.style.fontSize = '24px'; 
        this.emailInput.style.padding = '10px';
        this.emailInput.style.border = '8px';
        this.emailInput.style.fontFamily = 'PixelFont';

        document.body.appendChild(this.emailInput);

        const goInBtn = this.add.text(512, 400, 'Entrar',{
            fontFamily:'PixelFont',
            fontSize: '48px',
            color: '#00ff00'
        }).setInteractive({ useHandCursor: true });

        // FUNCIÓN QUE SIRVE PARA GESTIONAR HOVER EN BOTÓN ENTRAR
        goInBtn.on('pointerover', () => {
            // CAMBIA LA ESCALA
            goInBtn.setScale(1.2);
            // REPRODUCE SONIDO DE HOVER
            this.sound.play('button');
        })

        // FUNCIÓN QUE SIRVE PARA RESTABLECER ESTADO VISUAL AL SALIR EL MOUSE
        goInBtn.on('pointerout', () => {
            // RESTAURA TEXTURA NORMAL DEL BOTÓN
            goInBtn.setScale(1.0);
        })

        // FUNCIÓN QUE SIRVE PARA REANUDAR LA PARTIDA AL HACER CLICK
        goInBtn.on('pointerdown', () => {
            // LOG CON FINES DE DEPURACIÓN
            console.log('Login() llamado');
            // REPRODUCE SONIDO DE CLICK
            this.sound.play('buttonClick', {volume:0.5});

            this.login()
        })

        this.errorText = this.add.text(512, 500, '',{
            fontFamily: 'PixelFont',
            fontSize: '32px',
            color:'#ff0000'
        }).setOrigin(0.5);
    }

    async login(){
        const email = this.emailInput.value;

        console.log('Email introducido: ', email);

        try {
            const res = await fetch('/api/users/login',{
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await res.json();
            if(!res.ok){
                this.errorText.setText(data.error);
                return;
            }

            this.registry.set('user', data);

            this.emailInput.remove();

            this.scene.start('MenuScene');
        }catch(error){
            this.errorText.setText('Error');
        }
    }
}