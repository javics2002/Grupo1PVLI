import Box from './box.js';
import Player from './player.js';
import Rope from './rope.js';

/**
 * Escena principal del juego. La escena se compone de una serie de plataformas 
 * sobre las que se sitúan las bases en las podrán aparecer las estrellas. 
 * El juego comienza generando aleatoriamente una base sobre la que generar una estrella. 
 * Cada vez que el jugador recoge la estrella, aparece una nueva en otra base.
 * El juego termina cuando el jugador ha recogido 10 estrellas.
 * @extends Phaser.Scene
 */
export default class Debug extends Phaser.Scene {
  /**
   * Constructor de la escena
   */
  constructor() {
    super({ key: 'debug' });
  }

  /**
   * Creación de los elementos de la escena principal de juego
   */
  create() {

    let floorGap = 500;
    let floors = 3;

    this.matter.world.setBounds(0, 0, 1280, floors * 500 + 220);



    this.player = new Player(this, 200, 580 + floorGap * (floors - 1));
    this.matter.add.gameObject(this.player);
    for(let i = 0; i< floors; i++)
      ;

    this.cameras.main.setBounds(0, 0, 1280, floors * 500 + 220);
    this.cameras.main.startFollow(this.player);
    
    new Box(this, 300, 580 + floorGap * (floors - 1), 'smallbox');
    new Box(this, 300, 480 + floorGap * (floors - 1), 'smallbox');
    const ropes = this.matter.world.nextCategory();
    this.rope1 = new Rope(this, 600, 500 + floorGap * (floors - 1), 3, 2, 60);
    //this.matter.add.constraint(this.rope1, this.world);
    //this.rope1.setCollisionCategory(ropes);

    /*this.matter.world.on('collisionstart', 
    (hang, player, ropes) => {
      //Scottie se agarra a la cuerda
      this.scene.matter.add.constraint(obj1,
        obj2,
        50, // distancia
        0.5 // rigidez de la unión
        );
    });*/
  }

  //Metodo de ganar
  win()
  {
    this.scene.start('end');
  }
}