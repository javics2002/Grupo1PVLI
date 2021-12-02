import Tower from './tower.js';

export default class Tower2 extends Tower {
  constructor() {
    super('Tower 2', 40, 4, 18, 'torre2');
  }
  create(){
    super.create();
    this.cameraRanges = [{"max": 2868, "min": 2300},
    {"max": 2299, "min": 1715},
    {"max": 1714, "min":1140},
    {"max": 1139, "min":639},
    {"max": 630, "min":0}]
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