import Phaser from 'phaser';

export class CharacterSelectScene extends Phaser.Scene {
    constructor() {
        super('CharacterSelectScene');
    }

    preload(){
        this.load.image('wallpaper', 'assets/fondoInicio.png');
        this.load.image('gameTitle', 'assets/eleccionPersonaje/tituloJuego.png');

        this.load.image('acopC', 'assets/eleccionPersonaje/cabezaAcop.png');
        this.load.image('pacaC', 'assets/eleccionPersonaje/CabezaPaca.png');
        this.load.image('per2C', 'assets/eleccionPersonaje/CabezaPersonaje2.png');
        this.load.image('per3C', 'assets/eleccionPersonaje/CabezaPersonaje3.png');

        this.load.image('flechaD', 'assets/eleccionPersonaje/flechaDerecha.png');
        this.load.image('flechaI', 'assets/eleccionPersonaje/flechaIzquierda.png');

        this.load.image('pinturas', 'assets/eleccionPersonaje/InterfazEleccionPersonajes.png');
        this.load.image('sele', 'assets/eleccionPersonaje/seleccionado.png');

        this.load.image('tuto1', 'assets/eleccionPersonaje/tutorial/tutoJugador1.png');
        this.load.image('tuto2', 'assets/eleccionPersonaje/tutorial/tutoJugador2.png');

        this.load.audio('button', 'assets/efectosDeSonido/boton.mp3');
        this.load.audio('buttonClick', 'assets/efectosDeSonido/botonClick.mp3');
    }

    create() {
        if (!this.sound.get('menuMusic')) {
        this.mainTheme = this.sound.add('menuMusic', { loop: true });
        this.mainTheme.play();
        }

        const centerX = this.scale.width / 2;
        const centerY = this.scale.height / 2;

        // Fondo y título
        this.add.image(512, 384, 'wallpaper').setScale(2);
        this.add.image(540, 384, 'gameTitle');

        // Estados de confirmación de la selección
        this.jugador1Confirmado = false;
        this.jugador2Confirmado = false;

        // Personajes disponibles (izquierda = jugador1, derecha = jugador2)
        this.pjsJugador1 = ['pacaC', 'per3C'];
        this.pjsJugador2 = ['acopC', 'per2C'];
        this.sel1 = 0;
        this.sel2 = 0;

        // Marco pintura
        this.add.image(centerX, centerY, 'pinturas');

        // Carteles "seleccionado" (ocultos al inicio)
        this.selCartel1 = this.add.image(centerX - 250, centerY + 200, 'sele').setVisible(false).setDepth(5);
        this.selCartel2 = this.add.image(centerX + 280, centerY + 200, 'sele').setVisible(false).setDepth(5);

        // Cabezas
        this.head1 = this.add.image(centerX - 250, centerY + 200, this.pjsJugador1[this.sel1]).setDepth(4);
        this.head2 = this.add.image(centerX + 280, centerY + 220, this.pjsJugador2[this.sel2]).setDepth(4);

        this.add.image(420, 380,'tuto1');
        this.add.image(920, 380,'tuto2');

        // Controles por teclado para cambiar selección
        // Jugador 1: A/D y W/S (opcional)
        this.input.keyboard.on('keydown-A', () => this.cambiaPJ1(-1));
        this.input.keyboard.on('keydown-D', () => this.cambiaPJ1(+1));
        this.input.keyboard.on('keydown-W', () => this.cambiaPJ1(-1));
        this.input.keyboard.on('keydown-S', () => this.cambiaPJ1(+1));

        // Jugador 2: flechas izquierda/derecha (UP/DOWN también mapeadas)
        this.input.keyboard.on('keydown-LEFT', () => this.cambiaPJ2(-1));
        this.input.keyboard.on('keydown-RIGHT', () => this.cambiaPJ2(+1));
        this.input.keyboard.on('keydown-UP', () => this.cambiaPJ2(-1));
        this.input.keyboard.on('keydown-DOWN', () => this.cambiaPJ2(+1));

        // Confirmaciones: ESPACIO = jugador1, ENTER = jugador2
        this.input.keyboard.on('keydown-SPACE', () => this.confirmarJugador1());
        this.input.keyboard.on('keydown-ENTER', () => this.confirmarJugador2());
    }

    // Cambio personaje jugador 1
    cambiaPJ1(dir) {
        if (this.jugador1Confirmado) return; // bloqueo si ya confirmó
        this.sel1 = (this.sel1 + dir + this.pjsJugador1.length) % this.pjsJugador1.length;
        this.head1.setTexture(this.pjsJugador1[this.sel1]);
        this.sound.play('button');
    }

    // Cambio personaje jugador 2
    cambiaPJ2(dir) {
        if (this.jugador2Confirmado) return; // bloqueo si ya confirmó
        this.sel2 = (this.sel2 + dir + this.pjsJugador2.length) % this.pjsJugador2.length;
        this.head2.setTexture(this.pjsJugador2[this.sel2]);
        this.sound.play('button');
    }

    // Confirmar jugador 1 (ESPACIO)
    confirmarJugador1() {
        if (this.jugador1Confirmado) return;
        this.jugador1Confirmado = true;
        this.selCartel1.setVisible(true);
        this.sound.play('buttonClick', {volume:0.5});
        this.comprobarInicio();
    }

    // Confirmar jugador 2 (ENTER)
    confirmarJugador2() {
        if (this.jugador2Confirmado) return;
        this.jugador2Confirmado = true;
        this.selCartel2.setVisible(true);
        this.sound.play('buttonClick', {volume:0.5});
        this.comprobarInicio();
    }

    // Si ambos confirmaron, guardar y arrancar GameScene (con pequeño delay)
    comprobarInicio() {
        if (this.jugador1Confirmado && this.jugador2Confirmado) {
            //registramos la decision para poder usarlo en el gamescene
            this.registry.set('jugador1', this.pjsJugador1[this.sel1]);
            this.registry.set('jugador2', this.pjsJugador2[this.sel2]);

            // Delay para que el jugador vea los carteles
            this.time.delayedCall(600, () => {
                this.sound.stopAll();
                this.scene.start('GameScene');
            });
        }
    }
}

