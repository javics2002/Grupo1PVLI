export default class S extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y ) {
    super(scene, x, y, "brokenStair");
    scene.add.existing(this);
    
  }
}
