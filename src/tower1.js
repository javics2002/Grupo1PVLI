import Player from './player.js';

export default class Tower1 extends Phaser.Scene {
    /**
     * Constructor de la escena
     */
    constructor() {
      super({ key: 'tower1' });
      
      
    }
    /**
     * 
     */
    create() {
      let width = this.cameras.main.width;
      let height = this.cameras.main.height;

      this.player = new Player(this, 200, 1580);

      this.timer = 0;
      this.defeatTime = 60;


      // Botón volver a SelectScreen
      this.backButton = this.add.sprite(width * 0.05, height * 0.05, 'exit_icon').setInteractive();
      this.backButton.setOrigin(0, 0);

      this.backButton.on('pointerdown', function(event) {
        this.scene.scene.start('select');
      });


      let levelNameText = this.add.text(width - width * 0.15, height * 0.05, 'Tower 1',
      {
          fontFamily: 'Caveat',
          fontSize: 50,
          color: '#ffffff'
      })
      levelNameText.setOrigin(0, 0);

      this.timerText = this.add.text(width - width * 0.15, height * 0.12, this.timer.toString(),
      {
          fontFamily: 'Caveat',
          fontSize: 50,
          color: '#ffffff',
          align: 'right'
      })
      this.timerText.setOrigin(0, 0);


      // Dos decimales
      this.defeatTimeString = this.defeatTime.toFixed(2);

      this.defeatTimeText = this.add.text(width - width * 0.15, height * 0.17, this.defeatTimeString,
      {
          fontFamily: 'Caveat',
          fontSize: 30,
          color: '#ff0000',
          align: 'right',
      })
      this.timerText.setOrigin(0, 0);
    }

    update(t,dt) {
        super.update(t,dt);
        this.timer = this.timer + dt / 1000;

        // Dos decimales
        this.timerString = this.timer.toFixed(2);
        this.timerText.setText(this.timerString);

        if (this.timer > this.defeatTime){
          this.scene.start('tower1');
        }
    }
  }