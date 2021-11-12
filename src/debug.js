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
    let floorGap = 500;
    let floors = 3;

    this.matter.world.setBounds(0,0,1280, floors * 500 + 220);

   
    
    this.player = new Player(this, 200, 580 + floorGap * (floors - 1));
    for(let i = 0; i< floors; i++)
      new Platform(this, this.bases, false, 640, 630 + floorGap * i, 'longplatform');
    
    new Platform(this, this.bases, true, 700, 630 + floorGap * 2 - 160, 'platform');
    new Platform(this, this.bases, false, 300, 630 + floorGap * 2 - 320, 'platform');
    
    this.cameras.main.setBounds(0,0,1280, floors * 500 + 220);
    this.cameras.main.startFollow(this.player);
      
     
      this.spawn();
  }

  //Metodo de ganar
  win()
  {
    this.scene.start('end');
  }
    
spawn(from = null) {
    Phaser.Math.RND.pick(from || this.bases.children.entries).spawnStair();
  }
    
  starPickt (base) {
    this.player.point();
      if (this.player.score == this.stars) {
        this.scene.start('end');
      }
      else {
        let s = this.bases.children.entries;
        this.spawn(s.filter(o => o !== base));
      }
    }

   stairsPicked (base) {
      this.player.point();
        if (!this.player.brokenStair) {   
          this.player.brokenStair = true;
            return true;
        }
          return false;
    }
}