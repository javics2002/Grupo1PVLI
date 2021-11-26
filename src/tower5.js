import Tower from './tower.js';

export default class Tower5 extends Tower {
  constructor() {
    super('tower5', 200, 10, 18,'torre5');
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