import Tower from './tower.js';

export default class Tower1 extends Tower {
  constructor() {
    super('Tower 1', 20, 2, 18,'torre1');
  }

  create()
  {
    super.create();
    this.cameraRanges = [{"max": 1721, "min": 1145},
    {"max": 1146, "min":636},
    {"max": 635, "min":0}]

    
  }

  update(t, dt) {
    super.update(t, dt);
    
    this.cameraRanges.forEach(element => {
      if(this.player.y >= element.min && this.player.y < element.max){
          this.cameras.main.setBounds(0, element.min, 1280, element.max + element.min);
          this.cameras.main.startFollow(this.player);
      }
    //   if(this.player.y < element.min && this.player.y >= element.max){
    //     this.cameras.main.setBounds(0, element.min, 1280, element.max + element.min);
    //     this.cameras.main.startFollow(this.player);
    // }
    });
  }
}