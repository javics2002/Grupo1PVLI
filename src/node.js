/**
 * Nodo de una cuerda. Una cuerda está formada por varios nodos.
 */
 export default class Node extends Phaser.Physics.Matter.Sprite {
    /**
     * Constructora de la cuerda
     * @param {Phaser.Scene} scene Escena a la que pertenece el jugador
     * @param {number} x Coordenada X
     * @param {number} y Coordenada Y
     */
    constructor(scene, x, y) {
        super(scene.matter.world, x, y, 'rope');
        this.scene.add.existing(this);
    }
  
    /**
   * Métodos preUpdate de Phaser. Se encarga del balanceo de la cuerda.
   * @override
   */
    preUpdate(t, dt) {
      super.preUpdate(t, dt);
    }
  }