import Base from './base.js';
/**
 * Clase que representa las plataformas que aparecen en el escenario de juego.
 * Cada plataforma es responsable de crear la base que aparece sobre ella y en la 
 * que, durante el juego, puede aparecer una estrella
 */
export default class Platform extends Phaser.Physics.Matter.Sprite {
  
  /**
   * Constructor de la Plataforma
   * @param {Phaser.Scene} scene Escena a la que pertenece la plataforma
   * @param {Player} player Jugador del juego
   * @param {Phaser.GameObjects.Group} baseGroup Grupo en el que se incluirá la base creada por la plataforma
   * @param {number} x Coordenada x
   * @param {number} y Coordenada y
   * @param {Phaser.Image} img Imagen que utilizará la platforma para darse forma. Recuerda instanciarla en el boot.js
   * @param {boolean} hasBase Determina si la plataforma se creará con un objeto Base 
  */
  constructor(scene, baseGroup, hasBase, x, y, img) {
    super(scene.matter.world, x, y, img);
    this.scene.add.existing(this);
    this.setIgnoreGravity(true);
    this.setStatic(true);
    if(hasBase){
    new Base(scene, this, x, y, baseGroup);
    }
    
  }
}
