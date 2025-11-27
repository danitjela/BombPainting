import Phaser from 'phaser';

export class ComicScene extends Phaser.Scene {
  constructor() {
    super({ key: 'ComicScene' });
    this.totalPages = 5;
    this.currentPage = 0;
  }

  preload() {
    // Cargar páginas del cómic
    for (let i = 1; i <= this.totalPages; i++) {
      this.load.image(`comic${i}`, `assets/comic/comic${i}.png`);
    }

    // Cargar botones
    this.load.image('siguiente_off', 'assets/comic/botonSiguienteSinPulsar.png');
    this.load.image('siguiente_on', 'assets/comic/botonSiguientePulsado.png');
    this.load.image('volver_off', 'assets/comic/botonVolverSinPulsar.png');
    this.load.image('volver_on', 'assets/comic/botonVolverPulsado.png');

    
    this.load.audio('button', 'assets/efectosDeSonido/boton.mp3');
    this.load.audio('buttonClick', 'assets/efectosDeSonido/botonClick.mp3');
  }

  create() {
    this.buttonClickSound = this.sound.add('buttonClick', {volume:0.5});
    this.buttonHoverSound = this.sound.add('button');

    const { width, height } = this.scale;

    // Reiniciar página al crear la escena
    this.currentPage = 0;

    // Imagen del cómic
    this.comicImage = this.add.image(width / 2, height / 2, 'comic1');
    this._fitComicToScreen();

    // Botón volver (izquierda), invisible al inicio
    this.btnPrev = this.add.image(width * 0.165, height * 0.82, 'volver_off')
      .setDepth(10)
      .setScale(0.5)
      .setAlpha(0); // invisible inicialmente

    // Botón siguiente (derecha)
    this.btnNext = this.add.image(width * 0.835, height * 0.82, 'siguiente_off')
      .setInteractive({ useHandCursor: true })
      .setDepth(10)
      .setScale(0.5);

    // Asignar eventos del botón siguiente
    this._setupButtonEvents(this.btnNext, 'siguiente_off', 'siguiente_on', () => this._goNext());

    // Actualizar botones según la página actual
    this._updateButtons();
  }

  _fitComicToScreen() {
    const { width, height } = this.scale;
    const margin = 0.9;
    const img = this.comicImage;
    const ratio = img.width / img.height;
    const maxW = width * margin;
    const maxH = height * margin;

    if (maxW / maxH > ratio) {
      img.setDisplaySize(Math.round(maxH * ratio), Math.round(maxH));
    } else {
      img.setDisplaySize(Math.round(maxW), Math.round(maxW / ratio));
    }
  }

  _setupButtonEvents(button, normalKey, hoverKey, callback) {
    button.on('pointerover', () => {
      this.buttonHoverSound.play();
      button.setTexture(hoverKey);
    });
    button.on('pointerout', () => button.setTexture(normalKey));
    button.on('pointerdown', () => {
      this.buttonClickSound.play();
      callback();
    });
  }

  _updateButtons() {
    if (this.currentPage <= 0) {
      // Primera página: botón volver invisible y sin listeners
      this.btnPrev.setAlpha(0).disableInteractive().removeAllListeners();
    } else {
      // Páginas > 0: botón volver visible con eventos
      this.btnPrev.setAlpha(1).setInteractive({ useHandCursor: true }).removeAllListeners();
      this.btnPrev.setTexture('volver_off');
      this._setupButtonEvents(this.btnPrev, 'volver_off', 'volver_on', () => this._goPrev());
    }

    // Botón siguiente siempre visible
    this.btnNext.setAlpha(1).setInteractive({ useHandCursor: true });
  }

  _showPage(index) {
    this.currentPage = Phaser.Math.Clamp(index, 0, this.totalPages - 1);
    this.comicImage.setTexture(`comic${this.currentPage + 1}`);
    this._fitComicToScreen();
    this._updateButtons();
  }

  _goNext() {
    if (this.currentPage >= this.totalPages - 1) {
      this.scene.start('MenuScene'); // Última página → volver al menú
      return;
    }
    this._showPage(this.currentPage + 1);
  }

  _goPrev() {
    if (this.currentPage <= 0) return;
    this._showPage(this.currentPage - 1);
  }

  resize() {
    if (this.comicImage) this._fitComicToScreen();
  }
}


