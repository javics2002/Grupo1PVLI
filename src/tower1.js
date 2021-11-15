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

      this.timer = 0;
      this.player = new Player(this, 200, 1580);

      let levelNameText = this.add.text(width - width * 0.15, height * 0.05, 'Tower 1',
      {
          fontFamily: 'Caveat',
          fontSize: 50,
          color: '#ffffff'
      })
      levelNameText.setOrigin(0, 0);
    }

    preUpdate(t,dt) {
        super.preUpdate(t,dt);
        this.timer = this.timer + dt;

        console.log(this.timer);

        let timerText = this.add.text(width - width * 0.15, height * 0.1, this.timer.toString(),
      {
          fontFamily: 'Caveat',
          fontSize: 50,
          color: '#ffffff'
      })
      timerText.setOrigin(0, 0);
    }
  }