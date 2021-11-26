import Tower from './tower.js';

export default class Tower2 extends Tower {
  constructor() {
    super('Tower 2', 40, 4, 18, 'torre2');
  }
  create(){
    super.create();
    this.cameraRanges = [{"max": 860, "min": 0},
    {"max": 1720, "min": 861}]
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