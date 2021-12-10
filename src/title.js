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

    //Texto del título
    let titleText = this.add.text(this.sys.game.canvas.width/4.2 , this.sys.game.canvas.height/3 , 'VERTIGO TOWER',
      { fontFamily: 'Vertigon', fontSize: 60, color: '#e07a66' });
    titleText.setOrigin(0, 0);
    titleText.setShadow(2, 2, "#333333", 2, false, true);

    //Botón de PLAY
    let playButton = this.add.text(this.sys.game.canvas.width/2.2 , this.sys.game.canvas.height/1.8, 'Play ',
      {
        fontFamily: 'Caveat',
        fontSize: 50,
        color: '#ffffff'
      }).setInteractive();
    playButton.setOrigin(0, 0.5);
    playButton.on('pointerdown', pointer => {
      this.scene.start('select');
    });
    playButton.setShadow(2, 2, "#333333", 2, false, true);
  }
}