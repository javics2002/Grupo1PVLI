import Player from './player.js';
import Platform from './platform.js';

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
    this.stars = 10;
    this.bases = this.add.group();
    this.player = new Player(this, 200, 1300);
    new Platform(this, this.player, this.bases, 500, 250, 'platform');
    new Platform(this, this.player, this.bases, 200, 600, 'platform');
    new Platform(this, this.player, this.bases, 800, 1000, 'platform');
    new Platform(this, this.player, this.bases, 640, 1400, 'longplatform');

    let pisos = 2;
    this.cameras.main.setBounds(0,0,1280, pisos * 720);
    this.physics.world.bounds.width = 1280;
    this.physics.world.bounds.height = pisos * 720;

    this.cameras.main.startFollow(this.player);
  }
}