import Star from './star.js';
import StairFragment from './stairs.js'
/**
 * Clase que representa la base sobre la que se sitúan las estrellas que aparecen en el juego
 */
export default class Base extends Phaser.Physics.Matter.Sprite {
  
  /**
   * 
   * @param {Phaser.Scene} scene Escena a la que pertenece la base
   * @param {Platform} platform Plataforma sobre la que se sitúa la base
   * @param {number} x Coordenada x
   * @param {number} y Coordenada y 
   * @param { Phaser.GameObjects.Group } baseGroup Grupo en el que se incluirá la base creada
   */
  constructor(scene, platform, x, y, baseGroup) {
    super(scene.matter.world, x, y, 'base');
    this.scene.add.existing(this);
    baseGroup.add(this);
    this.y -= this.height / 2 + platform.height / 2;
  }

  /**
   * Método para que la base instancie una estrella sobre ella
   */
  spawn() {
    //this.scene.add.existing(new Star(this.scene, this, this.x, this.y));
  }

  spawnStair(){
    this.scene.add.existing(new StairFragment(this.scene, this, this.x, this.y));
  }

}

//hola