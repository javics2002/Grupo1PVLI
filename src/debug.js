import Box from './box.js';
import Player from './player.js';
import Shadow from './shadow.js';
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

  preload() {
    const config = {
      mute: false,
      volume: 1,
      rate: 1,
      detune: 0,
      seek: 0,
      loop: true,
      delay: 0,
    };
    this.cuphead = this.sound.add('cuphead', config);
  }

  /**
   * Creación de los elementos de la escena principal de juego
   */
  create() {
    let width = this.cameras.main.width;
    let height = this.cameras.main.height;

    let floorGap = 500;
    let floors = 3;

    this.matter.world.setBounds(0, 0, 1280, floors * 500 + 220);

    this.shadow = new Shadow(this, 200, 580 + floorGap * (floors - 1), 10);



    this.player = new Player(this, 200, 580 + floorGap * (floors - 1));
    for (let i = 0; i < floors; i++)
      ;

    this.cameras.main.setBounds(0, 0, 1280, floors * 500 + 220);
    this.cameras.main.startFollow(this.player);

    new Box(this, 300, 580 + floorGap * (floors - 1), 'smallbox');
    new Box(this, 300, 480 + floorGap * (floors - 1), 'smallbox');

    const ropes = this.matter.world.nextCategory();
    this.rope1 = new Rope(this, 600, 500 + floorGap * (floors - 1), 7);
    this.rope1.setCollisionCategory(ropes);

    this.matter.world.on('collisionstart',
      (event, player, ropes) => {
        if (player.gameObject !== null && ropes.gameObject !== null && player.gameObject.texture !== null && ropes.gameObject.texture !== null) {
          if ((player.gameObject.texture.key == "player" && ropes.gameObject.texture.key == "rope") || (player.gameObject.texture.key == "rope" && ropes.gameObject.texture.key == "player")) {
            //Scottie se agarra a la cuerda

            this.matter.add.constraint(player,
              ropes,
              0, // distancia
              0.5 // rigidez de la unión
            );

            //this.player.hangStart();
          }
        }
      });

    this.cuphead.play();

    let muteButton = this.add.text(width * 0.5, height * 0.2, 'Mute',
      {
        fontFamily: 'Caveat',
        fontSize: 30,
        color: '#ffffff'
      }).setInteractive();
    muteButton.setOrigin(0, 0.5);
    muteButton.setScrollFactor(0);
    muteButton.on('pointerdown', pointer => {
      this.cuphead.setMute(!this.cuphead.mute);
    });
    muteButton.setShadow(2, 2, "#333333", 2, false, true);
  }

  //Metodo de ganar
  win() {
    this.scene.start('end');
  }
}