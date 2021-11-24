import Player from './player.js';
import Shadow from './shadow.js';
export default class Tower extends Phaser.Scene {
  /**
   * Constructor de la escena
   * @param {string} key Nombre de la torre
   * @param {number} defeatTime Tiempo límite para completar el nivel
   * @param {integer} floors Número de plantas de la torre, sin contar el campanario
   * @param {integer} floorHeight Número de tiles que mide un piso
   */
  constructor(key, defeatTime, floors, floorHeight) {
    super({ key: key });

    this.key = key;
    this.defeatTime = defeatTime;
    this.floors = floors;
    this.floorHeight = floorHeight;
    this.tileSize = 32;
    this.margin = 2;
    this.lastRopeId = -1;
    this.canGrabLastRope = false;
    this.grabLastRopeTime = 100;
  }

  preload() {
    this.cuphead = this.sound.add('cuphead', this.game.audioConfig);
  }

  /**
   * Creación de los elementos de la escena principal de juego
   */
  create() {
    let width = this.cameras.main.width;
    let height = this.cameras.main.height;

    this.matter.world.setBounds(0, 0, 1280, (this.floors + 1) * this.floorHeight * this.tileSize + 2 *this.margin * this.tileSize);

    this.shadow = new Shadow(this, 200, (this.floors + 1) * this.floorHeight * this.tileSize, this.defeatTime);

    this.player = new Player(this, 200, (this.floors + 1) * this.floorHeight * this.tileSize);
    for (let i = 0; i < this.floors; i++)
      ;

    this.timer = 0;
    this.cameras.main.setBounds(0, 0, 1280, (this.floors + 1) * this.floorHeight * 32 + 32 * 4);
    this.cameras.main.startFollow(this.player);

    this.ropeConstraint = undefined;

    //Agarrarse a la cuerda
    this.matter.world.on('collisionstart',
      (event, player, ropes) => {
        if (player.gameObject !== null && ropes.gameObject !== null && player.gameObject.texture !== null && ropes.gameObject.texture !== null) {
          if ((player.gameObject.texture.key == "player" && ropes.gameObject.texture.key == "rope") || (player.gameObject.texture.key == "rope" && ropes.gameObject.texture.key == "player")) {
            //Scottie se agarra a la cuerda
            //Corrijo nombres de variables
            if(player.gameObject.texture.key == "rope" && ropes.gameObject.texture.key == "player")
            {
              let aux = player;
              player = ropes;
              ropes = aux;
            }
            //Puede que ya estemos agarrados a un nodo
            if (this.ropeConstraint === undefined) {
              //Para permitir el salto de una cuerda a otra, 
              //evitaremos engancharnos a otros nodos de la cuerda que acabamos de soltar
              if(this.lastRopeId !== ropes.gameObject.id || this.canGrabLastRope)
              {
                this.ropeConstraint = this.matter.add.constraint(player,
                  ropes,
                  0, // distancia
                  0.5 // rigidez de la unión
                );

                this.canGrabLastRope = false;
  
                console.log("engancho una cuerda");
                this.lastRopeId = ropes.gameObject.id;
                this.player.hangStart();
              }
            }
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
      this.game.audioConfig.mute = !this.game.audioConfig.mute;
      this.cuphead.setMute(!this.cuphead.mute);
    });
    muteButton.setShadow(2, 2, "#333333", 2, false, true);

    // Botón volver a SelectScreen
    this.backButton = this.add.sprite(width * 0.05, height * 0.05, 'exit_icon').setInteractive();
    this.backButton.setOrigin(0, 0);
    this.backButton.setScrollFactor(0);

    this.backButton.on('pointerdown', function (event) {
      this.scene.cuphead.stop();
      this.scene.scene.start('select');
    });

    let levelNameText = this.add.text(width - width * 0.15, height * 0.05, this.key,
      {
        fontFamily: 'Caveat',
        fontSize: 50,
        color: '#ffffff'
      })
    levelNameText.setOrigin(0, 0);

    levelNameText.setScrollFactor(0);


    this.timerText = this.add.text(width - width * 0.15, height * 0.12, this.timer.toString(),
      {
        fontFamily: 'Caveat',
        fontSize: 50,
        color: '#ffffff',
        align: 'right'
      })
    this.timerText.setOrigin(0, 0);

    this.timerText.setScrollFactor(0);


    // Dos decimales
    this.defeatTimeString = this.defeatTime.toFixed(2);

    this.defeatTimeText = this.add.text(width - width * 0.15, height * 0.17, this.defeatTimeString,
      {
        fontFamily: 'Caveat',
        fontSize: 30,
        color: '#ff0000',
        align: 'right'
      })
    this.defeatTimeText.setOrigin(0, 0);

    this.defeatTimeText.setScrollFactor(0);
  }

  update(t, dt) {
    super.update(t, dt);
    this.timer = this.timer + dt / 1000;

    // Dos decimales
    this.timerString = this.timer.toFixed(2);
    this.timerText.setText(this.timerString);

    if (this.timer > this.defeatTime) {
      this.lose();
    }

    //Condicion de ganar
    if (this.player.y < this.tileSize * (this.floorHeight + this.margin))
      this.win();

      console.log(this.canGrabLastRope);
  }

  //Metodo de ganar
  win() {
    this.cuphead.stop();
    let towerNumber = parseInt(this.key[6]);
    if(towerNumber < 5)
    {
      console.log('Tower ' + (towerNumber + 1));
      this.scene.start('Tower ' + (towerNumber + 1));
    }
    else 
      this.scene.start('select');
  }

  lose() {
    this.cuphead.stop();
    this.scene.start(this.key);
  }

  freePlayer() {
    console.log("suelto un nodo");
    this.matter.world.removeConstraint(this.ropeConstraint);
    this.ropeConstraint = undefined;
    setTimeout(this.canGrabRopeAgain, this.grabLastRopeTime, this);
  }

  canGrabRopeAgain(self)
  {
    self.canGrabLastRope = true;
    console.log("Ya puedo agarrar la ultima cuerda");
  }
}

//up_arrow: #f3463a
//down_arrow: #ffffff