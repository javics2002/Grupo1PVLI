/**
 * Pantalla principal
 */
export default class Title extends Phaser.Scene {
  constructor() {
    super({ key: 'title' });
  }

  create() {
    let width = this.cameras.main.width;
    let height = this.cameras.main.height;

    let titleArt = this.add.image(width, 0, 'title').setOrigin(1, 0);
    titleArt.setScale(.47);

    //Texto del título
    this.write(width * .07, height * .3, 'VERTIGO TOWER', { 
      fontFamily: 'Vertigon', 
      fontSize: 60, 
      color: '#e07a66' 
    });

    //Botón de PLAY
    let playButton = this.write(width * .2 , height * .5, 'PLAY ', {
      fontFamily: 'Caveat',
      fontSize: 50,
      color: '#ffffff'
    }).setInteractive();
    playButton.on('pointerdown', () => {
      this.scene.start('select');
    });
  }

  write(x, y, text, fontOptions) {
    let textElement = this.add.text(x, y, text, fontOptions);
    textElement.setOrigin(0, 0.5);
    textElement.setShadow(2, 2, "#333333", 2, false, true);
    return textElement;
  }
}