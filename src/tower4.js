import Tower from './tower.js';

export default class Tower4 extends Tower {
  constructor() {
    super('Tower 4', 120, 8, 18,'torre4');
  }
  create(){
    super.create();
    this.cameraRanges = [{"max": 5170, "min": 4600},
    {"max": 4599, "min": 4020},
    {"max": 4019, "min":2870},
    {"max": 2869, "min":2295},
    {"max": 2294, "min":1150},
    {"max": 1149, "min":640},
    {"max": 639, "min":0}]
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