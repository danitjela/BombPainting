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


        //CAJA DE TEXTO DONDE EL USUARIO PUEDE INTRODUCIR EL CORREO ELECTRÓNICO.
        //FUNCIÓN DE HTML
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

        //BOTÓN PARA VERIFICAR SI EL CORREO INTRODUCIDO ES VÁLIDO
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

        //TEXTO DE ERROR QUE SE MODIFICA SEGÚN EL ERROR DEVUELTO
        this.errorText = this.add.text(512, 500, '',{
            fontFamily: 'PixelFont',
            fontSize: '32px',
            color:'#ff0000'
        }).setOrigin(0.5);
    }

    async login(){
        //GUARDA EL VALOR INTRODUCIDO POR EL USUARIO
        const email = this.emailInput.value;

        console.log('Email introducido: ', email);

        //MÉTODO LOGIN DE APIREST
        try {
            const res = await fetch('/api/users/login',{
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await res.json();

            //SI DA ERROR SE ACTUALIZA EL TEXTO DE ERROR
            if(!res.ok){
                this.errorText.setText(data.error);
                return;
            }

            //SI EL USUARIO ES CORRECTO, GUARDA EL USUARIO, ELIMINA LA CAJA DE TEXTO DE HTML, Y SE PASA A MENUSCENE
            this.registry.set('user', data);

            this.emailInput.remove();

            this.scene.start('MenuScene');
        }catch(error){
            this.errorText.setText('Error');
        }
    }
}