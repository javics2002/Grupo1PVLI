import Box from './box.js';
import Player from './player.js';
import Rope from './rope.js';

/**
 * Escena de pruebas.
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
    this.rope1 = new Rope(this, 600, 500 + floorGap * (floors - 1), 7);
    this.rope1.setCollisionCategory(ropes);
    
    /*
    this.matter.world.on('collisionstart', 
    (hang, player, ropes) => {
      //Scottie se agarra a la cuerda
      this.matter.add.constraint(player,
        ropes,
        0, // distancia
        0.5 // rigidez de la unión
        );
    });
    */
  }

  //Metodo de ganar
  win()
  {
    this.scene.start('end');
  }
}