import Player from './player.js';
import Shadow from './shadow.js';
import Tower from './tower.js';

export default class Tower1 extends Tower {
  constructor() {
    super('tower1', 20, 2, 18);
    
    }



  create() {
    let width = this.cameras.main.width;
    let height = this.cameras.main.height;

    this.matter.world.setBounds(0, 0, 1280, 1720);
    this.cameraRanges = [{"max": 860, "min": 0},
    {"max": 1720, "min": 861}]
    this.player = new Player(this, 200, 1580);
    this.matter.add.gameObject(this.player);

    this.shadow = new Shadow(this, 400, 1500, this.defeatTime);

    this.timer = 0;

    
    
    this.cameras.main.setBounds(0, 0, 1280, 1720);
    this.cameras.main.startFollow(this.player);

    // Botón volver a SelectScreen
    this.backButton = this.add.sprite(width * 0.05, height * 0.05, 'exit_icon').setInteractive();
    this.backButton.setOrigin(0, 0);
    this.backButton.setScrollFactor(0);

    this.backButton.on('pointerdown', function (event) {
      this.scene.scene.start('select');
    });


    let levelNameText = this.add.text(width - width * 0.15, height * 0.05, 'Tower 1',
      {
        fontFamily: 'Caveat',
        fontSize: 50,
        color: '#ffffff'
      })
    levelNameText.setOrigin(0, 0);

    levelNameText.setScrollFactor(0);


    this.timerText = this.add.text(width - width * 0.15, height * 0.12, this.timer.toString(),
      {
        fontFamily: 'Caveat',
        fontSize: 50,
        color: '#ffffff',
        align: 'right'
      })
    this.timerText.setOrigin(0, 0);

    this.timerText.setScrollFactor(0);


    // Dos decimales
    this.defeatTimeString = this.defeatTime.toFixed(2);

    this.defeatTimeText = this.add.text(width - width * 0.15, height * 0.17, this.defeatTimeString,
      {
        fontFamily: 'Caveat',
        fontSize: 30,
        color: '#ff0000',
        align: 'right'
      })
    this.defeatTimeText.setOrigin(0, 0);

    this.defeatTimeText.setScrollFactor(0);
  }

  update(t, dt) {

    
    super.update(t, dt);
    this.timer = this.timer + dt / 1000;

    // Dos decimales
    this.timerString = this.timer.toFixed(2);
    this.timerText.setText(this.timerString);

    this.cameraRanges.forEach(element => {
      if(this.player.y >= element.min && this.player.y < element.max){
          this.cameras.main.setBounds(0, element.min, 1280, element.max + element.min);
          this.cameras.main.startFollow(this.player);
      }
    });

    if (this.timer > this.defeatTime) {
      this.lose();
    }
  }

  win() {
    this.game.levelsInfo[1].record = this.timerString;
    this.scene.start('tower2');
  }

  lose() {
    this.scene.start('tower1');
  }
}