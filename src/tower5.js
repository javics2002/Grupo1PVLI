import Tower from './tower.js';

export default class Tower5 extends Tower {
  constructor() {
    super('Tower 5', 200, 10, 18,'torre5');
  }

  create(){
    super.create();
    this.cameraRanges = [{"max": 6340, "min": 2870},
    {"max": 2869, "min": 1720},
    {"max": 1719, "min":641},
    {"max": 640, "min":0}]
  }

  update(t, dt) {
    super.update(t, dt);
    
    this.cameraRanges.forEach(element => {
      if(this.player.y >= element.min && this.player.y < element.max){
          this.cameras.main.setBounds(0, element.min, 1280, element.max + element.min);
          this.cameras.main.startFollow(this.player);
      }
    });
  }
}