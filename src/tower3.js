import Tower from './tower.js';

export default class Tower3 extends Tower {
  constructor() {
    super('tower3', 60, 6, 18,'torre3');
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