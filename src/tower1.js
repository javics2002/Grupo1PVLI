import Tower from './tower.js';

export default class Tower1 extends Tower {
  constructor() {
    super('Tower 1', 20, 2, 18,'torre1');
  }

  create()
  {
    super.create();
    this.cameraRanges = [{"max": 860, "min": 0},
    {"max": 1720, "min": 861}]

    // const map = this.make.tilemap({key : 'torre1'});
    // const tileset = map.addTilesetImage('torre1','tiles');
    
    // const coll = map.createLayer('Tower',tileset);
    // const stairs = map.createLayer('Interactuable',tileset);

    // coll.setCollisionByProperty({collides: true})
    // stairs.setCollisionByProperty({collides:true})
    
    // this.matter.world.convertTilemapLayer(coll);
    // this.matter.world.convertTilemapLayer(stairs);

    // stairs.forEachTile(function (tile) {
    //   // If your ladder tiles have a complex body made up of different parts, you'll need to iterate through
    //   // each part. If it's a simple rectangle, it will only have 1 part which is a reference to itself
    //   if (tile.properties.type === 'ladder') {
    //   tile.physics.matterBody.body.parts.forEach((part) => {
    //     part.isSensor = true;
    //   });
    // }
    // });
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