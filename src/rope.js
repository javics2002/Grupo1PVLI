import Node from "./node.js"

/**
 * Cuerda que Scottie agarra para balancearse. 
 * Esta formada por un pivote y varios nodos.
 */
export default class Rope extends Phaser.Physics.Matter.Sprite {
  /**
   * Constructora de la cuerda
   * @param {Phaser.Scene} scene Escena a la que pertenece el jugador
   * @param {number} x Coordenada X del pivote
   * @param {number} y Coordenada Y del pivote
   * @param {integer} length Número de nodos que cuelgan del pivote
   */
  constructor(scene, x, y, length) {
    super(scene.matter.world, x, y, 'pivot');
    this.setStatic(true);
    this.setSensor(true);

    this.scene.add.existing(this);
    let nodes = new Array(length);
    for(let i = 0; i < length; i++)
    {
      nodes[i] = new Node(scene, x, y + 10 * i);
      console.log(typeof(nodes[i]));
      let options = {
        bodyA: this,
        bodyB: nodes[i],
        length: 30,
        stiffness: 0.4
      };
      if (i > 0)
      {
        options = {
          bodyA: nodes[i - 1],
          bodyB: nodes[i],
          length: 32,
          stiffness: 0.4
        };
      }
        
      this.scene.matter.add.constraint(options.bodyA,options.bodyB,options.length,options.stiffness);
    }
  }

  /**
 * Métodos preUpdate de Phaser.
 * @override
 */
  preUpdate(t, dt) {
    super.preUpdate(t, dt);
  }
}