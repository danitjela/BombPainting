// SE IMPORTA PHASER PARA USAR LA ESCENA
import Phaser from 'phaser';

// FUNCIÓN QUE SIRVE PARA MOSTRAR LA PANTALLA DE SELECCIÓN DE PERSONAJES
export class CharacterSelectScene extends Phaser.Scene {
    // FUNCIÓN QUE SIRVE PARA INICIALIZAR LA ESCENA CON SU KEY
    constructor() {
        // SE LLAMA A CONSTRUCTOR PADRE Y ASIGNA KEY DE ESCENA
        super('CharacterSelectScene');
    }

    // FUNCIÓN QUE SIRVE PARA CARGAR RECURSOS (IMÁGENES Y AUDIO)
    preload(){
        // CARGA FONDO
        this.load.image('wallpaper', 'assets/fondoInicio.png');
        // CARGA TÍTULO
        this.load.image('gameTitle', 'assets/eleccionPersonaje/tituloJuego.png');

        // CARGA CABEZAS/SPRITES DE PERSONAJES
        this.load.image('acopC', 'assets/eleccionPersonaje/cabezaAcop.png');
        this.load.image('pacaC', 'assets/eleccionPersonaje/CabezaPaca.png');
        this.load.image('per2C', 'assets/eleccionPersonaje/CabezaPersonaje2.png');
        this.load.image('per3C', 'assets/eleccionPersonaje/CabezaPersonaje3.png');

        // CARGA FLECHAS DE NAVEGACIÓN
        this.load.image('flechaD', 'assets/eleccionPersonaje/flechaDerecha.png');
        this.load.image('flechaI', 'assets/eleccionPersonaje/flechaIzquierda.png');

        // CARGA INTERFAZ Y SELECCIONADO
        this.load.image('pinturas', 'assets/eleccionPersonaje/InterfazEleccionPersonajes.png');
        this.load.image('sele', 'assets/eleccionPersonaje/seleccionado.png');

        // CARGA TUTORIALES
        this.load.image('tuto1', 'assets/eleccionPersonaje/tutorial/tutoJugador1.png');
        this.load.image('tuto2', 'assets/eleccionPersonaje/tutorial/tutoJugador2.png');

        // CARGA EFECTOS DE SONIDO DE BOTONES
        this.load.audio('button', 'assets/efectosDeSonido/boton.mp3');
        this.load.audio('buttonClick', 'assets/efectosDeSonido/botonClick.mp3');
    }

    // FUNCIÓN QUE SIRVE PARA CREAR ELEMENTOS VISUALES, INPUTS Y LÓGICA DE SELECCIÓN
    create() {
        // SI NO HAY MÚSICA DE MENÚ, CREA Y REPRODUCE TEMA PRINCIPAL
        if (!this.sound.get('menuMusic')) {
            // CREA PISTA PRINCIPAL EN LOOP
            this.mainTheme = this.sound.add('menuMusic', { loop: true });
            // SE REPRODUCE EL TEMA PRINCIPAL
            this.mainTheme.play();
        }

        // SE CALCULA EL CENTRO DE PANTALLA
        const centerX = this.scale.width / 2;
        const centerY = this.scale.height / 2;

        // FONDO Y TÍTULO EN PANTALLA
        this.add.image(512, 384, 'wallpaper').setScale(2); // AÑADE FONDO ESCALADO
        this.add.image(540, 384, 'gameTitle');            // AÑADE TÍTULO

        // ESTADOS DE CONFIRMACIÓN DE SELECCIÓN INICIALES
        this.jugador1Confirmado = false; // FLAG JUGADOR 1
        this.jugador2Confirmado = false; // FLAG JUGADOR 2

        // LISTAS DE PERSONAJES DISPONIBLES (IZQUIERDA = J1, DERECHA = J2)
        this.pjsJugador1 = ['pacaC', 'per3C']; // ARRAY DE PERSONAJES J1
        this.pjsJugador2 = ['acopC', 'per2C']; // ARRAY DE PERSONAJES J2
        // ÍNDICES DE SELECCIÓN INICIALES
        this.sel1 = 0;
        this.sel2 = 0;

        // MARCO/INTERFAZ DE PINTURAS
        this.add.image(centerX, centerY, 'pinturas'); // AÑADE MARCO CENTRAL

        // CARTELES "SELECCIONADO" OCULTOS AL INICIO
        this.selCartel1 = this.add.image(centerX - 250, centerY + 200, 'sele').setVisible(false).setDepth(5);
        this.selCartel2 = this.add.image(centerX + 280, centerY + 200, 'sele').setVisible(false).setDepth(5);

        // CABEZAS DE LOS PERSONAJES A MOSTRAR
        this.head1 = this.add.image(centerX - 250, centerY + 200, this.pjsJugador1[this.sel1]).setDepth(4); // MUESTRA CABEZA J1
        this.head2 = this.add.image(centerX + 280, centerY + 220, this.pjsJugador2[this.sel2]).setDepth(4); // MUESTRA CABEZA J2

        // AÑADE IMÁGENES TUTORIAL EN PANTALLA
        this.add.image(420, 380,'tuto1');
        this.add.image(920, 380,'tuto2');

        // CONTROLES POR TECLADO PARA CAMBIAR SELECCIÓN (JUGADOR 1)
        // J1: A/D Y W/S MAPEADAS
        this.input.keyboard.on('keydown-A', () => this.cambiaPJ1(-1));
        this.input.keyboard.on('keydown-D', () => this.cambiaPJ1(+1));
        this.input.keyboard.on('keydown-W', () => this.cambiaPJ1(-1));
        this.input.keyboard.on('keydown-S', () => this.cambiaPJ1(+1));

        // CONTROLES POR TECLADO PARA CAMBIAR SELECCIÓN (JUGADOR 2)
        // J2: FLECHAS LEFT/RIGHT Y UP/DOWN MAPEADAS
        this.input.keyboard.on('keydown-LEFT', () => this.cambiaPJ2(-1));
        this.input.keyboard.on('keydown-RIGHT', () => this.cambiaPJ2(+1));
        this.input.keyboard.on('keydown-UP', () => this.cambiaPJ2(-1));
        this.input.keyboard.on('keydown-DOWN', () => this.cambiaPJ2(+1));

        // CONFIRMACIONES POR TECLADO: ESPACIO = J1, ENTER = J2
        this.input.keyboard.on('keydown-SPACE', () => this.confirmarJugador1());
        this.input.keyboard.on('keydown-ENTER', () => this.confirmarJugador2());
    }

    // FUNCIÓN QUE SIRVE PARA CAMBIAR PERSONAJE DE JUGADOR 1
    cambiaPJ1(dir) {
        // BLOQUEO SI YA SE CONFIRMÓ J1
        if (this.jugador1Confirmado) return;
        // SE ACTUALIZA EL ÍNDICE DE SELECCIÓN ROTANDO EN EL ARRAY
        this.sel1 = (this.sel1 + dir + this.pjsJugador1.length) % this.pjsJugador1.length;
        // SE ACTUALIZA LA TEXTURA DE LA CABEZA MOSTRADA
        this.head1.setTexture(this.pjsJugador1[this.sel1]);
        // SE REPRODUCE EL SONIDO DE NAVEGACIÓN
        this.sound.play('button');
    }

    // FUNCIÓN QUE SIRVE PARA CAMBIAR PERSONAJE DE JUGADOR 2
    cambiaPJ2(dir) {
        // BLOQUEO SI YA SE CONFIRMÓ J2
        if (this.jugador2Confirmado) return;
        // SE ACTUALIZA EL ÍNDICE DE SELECCIÓN ROTANDO EN EL ARRAY
        this.sel2 = (this.sel2 + dir + this.pjsJugador2.length) % this.pjsJugador2.length;
        // SE ACTUALIZA LA TEXTURA DE LA CABEZA MOSTRADA
        this.head2.setTexture(this.pjsJugador2[this.sel2]);
        // SE REPRODUCE EL SONIDO DE NAVEGACIÓN
        this.sound.play('button');
    }

    // FUNCIÓN QUE SIRVE PARA CONFIRMAR SELECCIÓN DEL JUGADOR 1 (ESPACIO)
    confirmarJugador1() {
        // BLOQUEO SI YA ESTÁ CONFIRMADO
        if (this.jugador1Confirmado) return;
        // SE MARCA EL JUGADOR 1 COMO CONFIRMADO
        this.jugador1Confirmado = true;
        // SE MUESTRA EL CARTEL DE SELECCIONADO PARA J1
        this.selCartel1.setVisible(true);
        // SE REPRODUCE EL SONIDO DE CONFIRMACIÓN
        this.sound.play('buttonClick', {volume:0.5});
        // SE COMPRUEBA SI AMBOS JUGADORES HAN CONFIRMADO PARA INICIAR PARTIDA
        this.comprobarInicio();
    }

    // FUNCIÓN QUE SIRVE PARA CONFIRMAR SELECCIÓN DEL JUGADOR 2 (ENTER)
    confirmarJugador2() {
        // BLOQUEO SI YA ESTÁ CONFIRMADO
        if (this.jugador2Confirmado) return;
        // SE MARCA EL JUGADOR 2 COMO CONFIRMADO
        this.jugador2Confirmado = true;
        // SE MUESTRA EL CARTEL DE SELECCIONADO PARA J2
        this.selCartel2.setVisible(true);
        // SE REPRODUCE EL SONIDO DE CONFIRMACIÓN
        this.sound.play('buttonClick', {volume:0.5});
        // SE COMPRUEBA SI AMBOS JUGADORES HAN CONFIRMADO PARA INICIAR PARTIDA
        this.comprobarInicio();
    }

    // FUNCIÓN QUE SIRVE PARA INICIAR LA PARTIDA SI AMBOS JUGADORES HAN CONFIRMADO
    comprobarInicio() {
        // SI AMBOS HAN CONFIRMADO, SE GUARDA LA ELECCIÓN Y SE CAMBIA A LA ESCENA DE JUEGO
        if (this.jugador1Confirmado && this.jugador2Confirmado) {
            // REGISTRA LA DECISIÓN EN EL REGISTRY PARA USO EN LA ESCENA DE JUEGO
            this.registry.set('jugador1', this.pjsJugador1[this.sel1]);
            this.registry.set('jugador2', this.pjsJugador2[this.sel2]);

            // RETARDO PARA QUE EL JUGADOR PUEDA VER LOS CARTELES
            this.time.delayedCall(600, () => {
                // DETIENE TODOS LOS SONIDOS
                this.sound.stopAll();
                // CAMBIA A LA ESCENA DE JUEGO
                this.scene.start('GameScene');
            });
        }
    }
}