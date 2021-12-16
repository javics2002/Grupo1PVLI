/**
 * TODO Cambiar los comentarios de este scrit, sigue haciendo referencia a Star
 * Clase fragmento de estrella. Maneja las colisiones con el jugador y 
 * @extends Phaser.GameObjects.Sprite
 */
export default class StairFragment extends Phaser.Physics.Matter.Sprite {
  
  /**
   * Constructor de Star
   * @param {Scene} scene Escena en la que aparece la estrella
   * @param {Base} base Objeto base sobre el que se va a dibujar la estrella
   * @param {number} x coordenada x
   * @param {number} y coordenada y
   */
  constructor(scene, base, x, y) {
    super(scene.matter.world, x, y, 'brokenStair');
    this.scene.add.existing(this);
  
    this.y -= this.height;
    this.base = base;
  

  }

  /**
   * Redefinición del preUpdate de Phaser
   * @override
   */
  preUpdate() {
    // IMPORTANTE: Si no ponemos esta instrucción y el sprite está animado
    // no se podrá ejecutar la animación del sprite. 
    super.preUpdate();
    if (this.scene.matter.overlap(this.scene.player, this)) {
        if(this.scene.stairsPicked(this.base)) this.destroy();
    }
  }
}
