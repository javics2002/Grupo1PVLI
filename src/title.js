/**
 * Pantalla principal
 */
export default class Title extends Phaser.Scene {
    /**
     * Constructor de la escena
     */
    constructor() {
      super({ key: 'title' });
    }

    
  
    /**
     * 
     */
    preload() {
      
    }
  
    /**
     * 
     */
     create(){
      let width = this.cameras.main.width;
      let height = this.cameras.main.height;

      let titleText = this.add.text(width *0.1, height * 0.3, 'VERTIGO TOWER', 
            { fontFamily: 'Vertigon', fontSize: 60, color: '#e07a66' });
      titleText.setOrigin(0, 0);
      titleText.setShadow(2, 2, "#333333", 2, false, true);

      let self = this; // Para usarlo en active
      WebFont.load({
          google: {
              families: [ 'Caveat' ]
          },
        active: function () // se llama a esta función cuando está cargada
        {
          let playButton = self.add.text(width * 0.3, height * 0.6, 'Play ',
            { fontFamily: 'Caveat', 
            fontSize: 50, 
            color: '#ffffff' 
          }).setInteractive();
          playButton.setOrigin(0, 0.5);
          playButton.on('pointerdown', pointer => {
            self.scene.start('debug');
          });
          playButton.setShadow(2, 2, "#333333", 2, false, true);
        }
      });
     }
  }