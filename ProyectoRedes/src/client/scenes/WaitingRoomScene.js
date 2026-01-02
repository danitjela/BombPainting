import Phaser from 'phaser';

// CLASE QUE SIRVE PARA GESTIONAR LA PANTALLA PRINCIPAL DEL MENÚ
export class WaitingRoomScene extends Phaser.Scene {
	// FUNCIÓN QUE SIRVE PARA CONSTRUIR LA ESCENA DEL MENÚ
	constructor() {
		super('WaitingRoomScene'); // CREA NOMBRE DE LA ESCENA
	}

	preload(){
		// CARGA IMAGEN DE FONDO DEL MENÚ DE ESPERA
        this.load.image('backgroundWaiting', 'assets/MenuPausa/ManchaPausa.png');

		// CARGA BOTÓN VOLVER (ESTADOS NORMAL Y HOVER)
        this.load.image('returnBtnHover', 'assets/menuCreditos/botonVolverPulsado.png');
        this.load.image('returnBtn', 'assets/menuCreditos/botonVolverSinPulsar.png');

		// CARGA EFECTOS DE SONIDO DE BOTÓN
        this.load.audio('button', 'assets/efectosDeSonido/boton.mp3');
        this.load.audio('buttonClick', 'assets/efectosDeSonido/botonClick.mp3');
	}

	create(data) {
		// RECIBE EL WEBSOCKET DE MENUSCENE
		this.ws = data.ws;

		// SE AÑADEN ASSETS
		this.add.image(512,378,'backgroundWaiting').setOrigin(0.5);

		this.text = this.add.text(512, 378, 'Buscando jugadores...', {
			fontSize: '48px',
			fontFamily: 'PixelFont',
			color: '#ffffff'
		}).setOrigin(0.5);

		// SE CREA UN HANDLER DEL LISTENER
		this.waitingHandler = (event) =>{
			const msg = JSON.parse(event.data);

			switch(msg.type){
				// PARA EL ESTADO DE LA COLA, DICE EL NÚMERO DE JUGADORES QUE HAY
				case 'queueStatus':
					this.text.setText(
						`En cola (${msg.position}/${msg.total})`
					);
					break;
				
				case 'gameStart':
					// SI LA PARTIDA EMPIEZA, SE ELIMINA EL LISTENER Y LANZA GAMESCENE CON EL MODO, EL WEBSOCKET, EL ROOMID Y EL ROLE
					this.ws.removeEventListener('message', this.waitingHandler);
					this.scene.start('GameScene', {
						ws: this.ws,
						roomId: msg.roomId,
						role: msg.role,
						mode: 'online'
					});
					break;
			}
		};
		//SE CREA EL LISTENER Y SE NOTIFICA AL SERVIDOR DE QUE UN CLIENTE ESTÁ EN COLA
		this.ws.addEventListener('message', this.waitingHandler);

		this.ws.send(JSON.stringify({ type: 'joinQueue' }));

		// CREA BOTÓN DE VOLVER 
        const returnBtn = this.add.image(300, 570, 'returnBtn').setInteractive({ useHandCursor: true }).setScale(0.8);

		// APARIENCIA DEL BOTÓN VOLVER
        // HOVER: REPRODUCE SONIDO Y CAMBIA TEXTURA A ESTADO HOVER
        returnBtn.on('pointerover', () => {
            this.sound.play('button'); // REPRODUCE SONIDO HOVER
            returnBtn.setTexture('returnBtnHover'); // CAMBIA TEXTURA A HOVER
        });

        // OUT: RESTAURA TEXTURA NORMAL
        returnBtn.on('pointerout', () => {
            returnBtn.setTexture('returnBtn');// RESTAURA TEXTURA NORMAL
        });

        // CLICK: REPRODUCE SONIDO DE CLICK Y CAMBIA A LA ESCENA DE MENÚ
        returnBtn.on('pointerdown', () => {
            console.log('Return Menu'); // LOG PARA DEBUG
            this.sound.play('buttonClick', {volume:0.5}); // REPRODUCE SONIDO CLICK
			this.ws.send(JSON.stringify({ type: 'leaveQueue' }));
			this.ws.close();
			this.ws.onmessage = null;
			this.scene.stop(); //PARA LA ESCENA DE WAITINGROOM
            this.scene.resume('MenuScene'); // CAMBIA A ESCENA MENU
        });
	}
}