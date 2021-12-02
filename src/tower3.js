import Tower from './tower.js';

export default class Tower3 extends Tower {
  constructor() {
    super('Tower 3', 60, 6, 18,'torre3');
  }
  create(){
    super.create();
    this.cameraRanges = [{"max": 4020, "min": 3445},
    {"max": 3444, "min": 2290},
    {"max": 2289, "min": 1720},
    {"max": 1719, "min":640},
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