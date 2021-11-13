



export default class S extends Phaser.Physics.Matter.Sprite {
  constructor(scene, x, y ) {
    super(scene.matter.world, x, y, "brokenStair");
    scene.add.existing(this);
    
  }
}
