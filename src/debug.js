import Tower from './tower.js';
import Rope from './rope.js';
import Box from './box.js';

/**
 * Escena de pruebas.
 * @extends Phaser.Scene
 */
export default class Debug extends Tower {
  /**
   * Constructor de la escena
   */
  constructor() {
    super('Debug', 30, 2, 18);
  }

  preload()
  {
    super.preload();
  }

  create()
  {
    super.create();
    new Box(this, 300, 580 + 32 * this.floorHeight * (this.floors - 1), 'smallbox');
    new Box(this, 300, 480 + 32 * this.floorHeight * (this.floors - 1), 'smallbox');

    const ropes = this.matter.world.nextCategory();
    this.rope1 = new Rope(this, 600, 1400, 7, 1);
    this.rope2 = new Rope(this, 900, 1000, 5, 2);
    this.rope3 = new Rope(this, 900, 1500, 7, 3);
    this.rope1.setCollisionCategory(ropes);
    this.rope2.setCollisionCategory(ropes);
    this.rope3.setCollisionCategory(ropes);
  }

  update(t, dt)
  {
    super.update(t, dt);
  }
}