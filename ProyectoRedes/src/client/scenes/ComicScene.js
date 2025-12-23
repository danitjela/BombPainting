// IMPORTA PHASER PARA USAR EL FRAMEWORK
import Phaser from 'phaser';

// FUNCIÓN QUE SIRVE PARA MOSTRAR UN CÓMIC MULTI-PÁGINA CON NAVEGACIÓN
export class ComicScene extends Phaser.Scene {
  // FUNCIÓN QUE SIRVE PARA INICIALIZAR LA ESCENA Y SUS CONTADORES DE PÁGINAS
  constructor() {
    // LLAMA A CONSTRUCTOR PADRE Y ASIGNA KEY
    super({ key: 'ComicScene' });
    // TOTAL DE PÁGINAS DEL CÓMIC
    this.totalPages = 5;
    // PÁGINA ACTUAL INICIAL
    this.currentPage = 0;
  }

  // FUNCIÓN QUE SIRVE PARA CARGAR RECURSOS (IMÁGENES Y SONIDOS)
  preload() {
    // CREA CARGA DE CADA PÁGINA DEL CÓMIC
    for (let i = 1; i <= this.totalPages; i++) {
      this.load.image(`comic${i}`, `assets/comic/comic${i}.png`);
    }

    // CREA CARGA DE BOTONES (ESTADO OFF/ON)
    this.load.image('siguiente_off', 'assets/comic/botonSiguienteSinPulsar.png');
    this.load.image('siguiente_on', 'assets/comic/botonSiguientePulsado.png');
    this.load.image('volver_off', 'assets/comic/botonVolverSinPulsar.png');
    this.load.image('volver_on', 'assets/comic/botonVolverPulsado.png');

    // CREA CARGA DE EFECTOS DE SONIDO
    this.load.audio('button', 'assets/efectosDeSonido/boton.mp3');
    this.load.audio('buttonClick', 'assets/efectosDeSonido/botonClick.mp3');
  }

  // FUNCIÓN QUE SIRVE PARA CREAR ELEMENTOS VISUALES, BOTONES Y ASIGNAR EVENTOS
  create() {
    // Forzar la carga de la fuente personalizada
    this.add.text(-1000, -1000, 'font-load', {
    fontFamily: 'PixelFont',
    fontSize: '32px'
    });
    // CREA INSTANCIAS DE SONIDO PARA USO EN BOTONES
    this.buttonClickSound = this.sound.add('buttonClick', {volume:0.5});
    this.buttonHoverSound = this.sound.add('button');

    // OBTIENE TAMAÑO DE PANTALLA
    const { width, height } = this.scale;

    // RESETEA PÁGINA ACTUAL AL CREAR LA ESCENA
    this.currentPage = 0;

    // CREA IMAGEN DEL CÓMIC Y AJUSTA A PANTALLA
    this.comicImage = this.add.image(width / 2, height / 2, 'comic1');
    this._fitComicToScreen();

    // CREA BOTÓN "VOLVER" (IZQUIERDA), INVISIBLE AL INICIO
    this.btnPrev = this.add.image(width * 0.165, height * 0.82, 'volver_off')
      .setDepth(10)
      .setScale(0.5)
      .setAlpha(0); // OCULTO INICIALMENTE

    // CREA BOTÓN "SIGUIENTE" (DERECHA) E INTERACTIVO
    this.btnNext = this.add.image(width * 0.835, height * 0.82, 'siguiente_off')
      .setInteractive({ useHandCursor: true })
      .setDepth(10)
      .setScale(0.5);

    // ASIGNA EVENTOS (HOVER/CLICK) AL BOTÓN SIGUIENTE
    this._setupButtonEvents(this.btnNext, 'siguiente_off', 'siguiente_on', () => this._goNext());

    // ACTUALIZA ESTADO Y LISTENERS DE LOS BOTONES SEGÚN PÁGINA ACTUAL
    this._updateButtons();
  }

  // FUNCIÓN QUE SIRVE PARA AJUSTAR LA IMAGEN DEL CÓMIC AL TAMAÑO DE PANTALLA CONSERVANDO RATIO
  _fitComicToScreen() {
    // SE OBTIENEN DIMENSIONES Y MÁRGEN DE AJUSTE
    const { width, height } = this.scale;
    const margin = 0.9;
    const img = this.comicImage;
    // CALCULA RATIO ORIGINAL DE LA IMAGEN
    const ratio = img.width / img.height;
    // CALCULA MÁXIMOS DISPONIBLES
    const maxW = width * margin;
    const maxH = height * margin;

    // AJUSTA DISPLAY SIZE MANTENIENDO RATIO
    if (maxW / maxH > ratio) {
      img.setDisplaySize(Math.round(maxH * ratio), Math.round(maxH));
    } else {
      img.setDisplaySize(Math.round(maxW), Math.round(maxW / ratio));
    }
  }

  // FUNCIÓN QUE SIRVE PARA CONFIGURAR LOS EVENTOS VISUALES Y SONOROS DE UN BOTÓN
  _setupButtonEvents(button, normalKey, hoverKey, callback) {
    // REPRODUCE SONIDO Y CAMBIA TEXTURA AL PASAR EL PUNTERO
    button.on('pointerover', () => {
      this.buttonHoverSound.play();
      button.setTexture(hoverKey);
    });
    // RESTAURA TEXTURA AL QUITAR PUNTERO
    button.on('pointerout', () => button.setTexture(normalKey));
    // REPRODUCE SONIDO Y EJECUTA CALLBACK AL PULSAR
    button.on('pointerdown', () => {
      this.buttonClickSound.play();
      callback();
    });
  }

  // FUNCIÓN QUE SIRVE PARA ACTUALIZAR VISIBILIDAD Y LISTENERS DE BOTONES SEGÚN PÁGINA
  _updateButtons() {
    // SI ESTAMOS EN LA PRIMERA PÁGINA, OCULTA BOTÓN VOLVER Y LO DESACTIVA
    if (this.currentPage <= 0) {
      this.btnPrev.setAlpha(0).disableInteractive().removeAllListeners();
    } else {
      // SI NO, MUESTRA BOTÓN VOLVER Y LO HACE INTERACTIVO
      this.btnPrev.setAlpha(1).setInteractive({ useHandCursor: true }).removeAllListeners();
      this.btnPrev.setTexture('volver_off');
      this._setupButtonEvents(this.btnPrev, 'volver_off', 'volver_on', () => this._goPrev());
    }

    // ASEGURA QUE EL BOTÓN SIGUIENTE ESTÉ VISIBLE E INTERACTIVO
    this.btnNext.setAlpha(1).setInteractive({ useHandCursor: true });
  }

  // FUNCIÓN QUE SIRVE PARA MOSTRAR UNA PÁGINA DEL CÓMIC Y ACTUALIZAR ESTADO
  _showPage(index) {
    // CLAMPEA ÍNDICE ENTRE 0 Y TOTAL-1
    this.currentPage = Phaser.Math.Clamp(index, 0, this.totalPages - 1);
    // CAMBIA TEXTURA DE LA IMAGEN AL NOMBRE CORRESPONDIENTE
    this.comicImage.setTexture(`comic${this.currentPage + 1}`);
    // AJUSTA LA IMAGEN AL TAMAÑO DE PANTALLA
    this._fitComicToScreen();
    // ACTUALIZA BOTONES SEGÚN NUEVA PÁGINA
    this._updateButtons();
  }

  // FUNCIÓN QUE SIRVE PARA AVANZAR PÁGINA O SALIR AL MENU SI ES LA ÚLTIMA
  _goNext() {
    // SI ESTAMOS EN LA ÚLTIMA PÁGINA, VUELVE AL MENU
    if (this.currentPage >= this.totalPages - 1) {
      this.scene.start('LoginScene'); // LOGIN
      return;
    }
    // MUESTRA LA SIGUIENTE PÁGINA
    this._showPage(this.currentPage + 1);
  }

  // FUNCIÓN QUE SIRVE PARA VOLVER A LA PÁGINA ANTERIOR SI NO ES LA PRIMERA
  _goPrev() {
    // SI ESTAMOS EN LA PRIMERA, NO HACE NADA
    if (this.currentPage <= 0) return;
    // MUESTRA LA PÁGINA ANTERIOR
    this._showPage(this.currentPage - 1);
  }

  // FUNCIÓN QUE SIRVE PARA AJUSTAR LA IMAGEN SI LA VENTANA CAMBIA DE TAMAÑO
  resize() {
    // SI EXISTE LA IMAGEN, LA AJUSTA AL NUEVO TAMAÑO
    if (this.comicImage) this._fitComicToScreen();
  }
}