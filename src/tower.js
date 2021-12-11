import Player from './player.js';
import Shadow from './shadow.js';
export default class Tower extends Phaser.Scene {
  /**
   * Constructor de la escena
   * @param {string} key Nombre de la torre
   * @param {number} defeatTime Tiempo límite para completar el nivel
   * @param {integer} floors Número de plantas de la torre, sin contar el campanario
   * @param {integer} floorHeight Número de tiles que mide un piso
   * @param {integer} keyTile
   */
  constructor(key, defeatTime, floors, floorHeight, keyTile) {
    super({ key: key });
    this.keyTile = keyTile;
    this.key = key;
    this.defeatTime = defeatTime;
    this.floors = floors;
    this.floorHeight = floorHeight;
    this.tileSize = 32;
    this.margin = 2;
    this._lastRopeId = -1;
    this._canGrabLastRope = false;
    this._grabLastRopeTime = 100;
    this._reachedTop = false;
    this.hasTimerStarted = false;

    //La sombrá llegará a Judy cuando la música "tower" llegue a estos segundos
    this._loseMusicTime = 320;
    this._startMusicTime = this._loseMusicTime - (this.defeatTime * 1.5);

    this.musicMarker = {
      name: this.key,
      start: this._startMusicTime,
      duration: this.defeatTime * 1.5 + 5
    };
  }

  preload() {
    //Cargamos la musica
    this.music = this.sound.add('tower', this.game.audioConfig);
    this.winMusic = this.sound.add('win', this.game.audioConfig);

    this.music.addMarker(this.musicMarker);
    this.winMusic.addMarker({
      name: "winPart",
      start: 268,
      duration: 7.5
    })

    //Cargamos los sonidos
    this.help_me = this.sound.add('help_me');
    this.fall = this.sound.add('fall');
    this.scream = this.sound.add('scream');
    this.thump = this.sound.add('thump');
  }

  /**
   * Creación de los elementos comunes a todas las torres
   */
  create() {
    this.frameTime = 0;
    this.matter.world.autoUpdate = false;

    //Tamaño del mapa
    let width = this.cameras.main.width;
    let height = this.cameras.main.height;

    this.matter.world.setBounds(0, 0, 1280, (this.floors + 1) * this.floorHeight * this.tileSize + 2 * this.margin * this.tileSize);

    //Tiles
    const map = this.make.tilemap({ key: this.keyTile });
    const tileset = map.addTilesetImage(this.keyTile, 'tiles');

    const coll = map.createLayer('Tower', tileset);
    const stairs = map.createLayer('Interactuable', tileset);

    coll.setCollisionByProperty({ collides: true })
    stairs.setCollisionByProperty({ collides: true })

    this.matter.world.convertTilemapLayer(coll);
    this.matter.world.convertTilemapLayer(stairs);

    stairs.forEachTile(function (tile) {
      // If your ladder tiles have a complex body made up of different parts, you'll need to iterate through
      // each part. If it's a simple rectangle, it will only have 1 part which is a reference to itself
      if (tile.properties.type === 'ladder') {
        tile.physics.matterBody.body.parts.forEach((part) => {
          part.isSensor = true;
        });
      }
      else if (tile.properties.type === 'fragment') {
        tile.physics.matterBody.body.parts.forEach((part) => {
          part.isSensor = true;
        });
      }
    });

    //Personajes
    this.player = new Player(this, 400, (this.floors + 1) * this.floorHeight * this.tileSize, coll, { restitution: 1, label: 'player' });
    this.shadow = new Shadow(this, 200, (this.floors + 1) * this.floorHeight * this.tileSize, this.defeatTime);

    //Timer
    this.timer = 0;

    //Camara
    this.cameras.main.setBounds(0, 0, 1280, (this.floors + 1) * this.floorHeight * 32 + 32 * 4);
    this.cameras.main.startFollow(this.player);

    this.ropeConstraint = undefined;

    //Agarrarse a la cuerda
    this.matter.world.on('collisionstart',
      (event, player, ropes) => {
        if (ropes.gameObject.body.label != 'Rectangle Body') {
          if (player.gameObject !== null && ropes.gameObject !== null && player.gameObject.texture !== undefined && ropes.gameObject.texture !== undefined) {
            if ((player.gameObject.texture.key == "player" && ropes.gameObject.texture.key == "rope") || (player.gameObject.texture.key == "rope" && ropes.gameObject.texture.key == "player")) {
              //Scottie se agarra a la cuerda
              //Corrijo nombres de variables
              if (player.gameObject.texture.key == "rope" && ropes.gameObject.texture.key == "player") {
                let aux = player;
                player = ropes;
                ropes = aux;
              }
              //Puede que ya estemos agarrados a un nodo
              if (this.ropeConstraint === undefined) {
                //Para permitir el salto de una cuerda a otra, 
                //evitaremos engancharnos a otros nodos de la cuerda que acabamos de soltar
                if (this._lastRopeId !== ropes.gameObject.id || this._canGrabLastRope) {
                  this.ropeConstraint = this.matter.add.constraint(player,
                    ropes,
                    0, // distancia
                    0.5 // rigidez de la unión
                  );

                  this._canGrabLastRope = false;

                  console.log("engancho una cuerda");
                  this._lastRopeId = ropes.gameObject.id;
                  this.player.hangStart();
                }
              }
            }
          }
        }
      });

    //Música
    this.music.play(this.key);
    this.music.setRate(1.5);

    //UI
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
      this.music.setMute(!this.music.mute);
    });
    muteButton.setShadow(2, 2, "#333333", 2, false, true);

    // Botón volver a SelectScreen
    this.backButton = this.add.sprite(width * 0.05, height * 0.05, 'exit_icon').setInteractive();
    this.backButton.setOrigin(0, 0);
    this.backButton.setScrollFactor(0);

    this.backButton.on('pointerdown', function (event) {
      this.scene.music.stop();
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

    //Flechas de marca para la sombra
    this.upArrow = this.add.sprite(this.shadow.x, 32, "up_arrow");
    this.upArrow.setScrollFactor(0);
    this.upArrow.setOrigin(0.5, 0);
    this.upArrow.setTint(0Xf3463a);
    this.downArrow = this.add.sprite(this.shadow.x, height - 32, "down_arrow");
    this.downArrow.setScrollFactor(0);
    this.downArrow.setOrigin(0.5, 1);

    //Reseteamos el haber llegado a la cima
    this._reachedTop = false;
  }

  update(t, dt) {
    super.update(t, dt);

    this.frameTime += dt;
    if (this.frameTime > 16.5) {
      this.frameTime -= 16.5;

      if (!this._reachedTop && this.hasTimerStarted) {
        this.timer = this.timer + dt / 1000;

        // Dos decimales
        this.timerString = this.timer.toFixed(2);
        this.timerText.setText(this.timerString);

        if (this.timer > this.defeatTime)
          this.lose();
      }

      //Actualizar flechas de la sombra
      if (!this._reachedTop && this.cameras.main.scrollY + this.cameras.main.height < this.shadow.y)
        this.downArrow.setVisible(true);
      else
        this.downArrow.setVisible(false);
      if (!this._reachedTop && this.cameras.main.scrollY > this.shadow.y)
        this.upArrow.setVisible(true);
      else
        this.upArrow.setVisible(false);

      //Condicion de ganar
      if (!this._reachedTop && this.player.y < this.tileSize * (this.floorHeight + this.margin))
        this.win();

      this.matter.world.step();
    }
  }

  //Metodo de ganar
  win() {
    this._reachedTop = true;

    //Paramos la musica y la sombra
    this.music.stop();
    this.shadow.stop();

    //Desactivar movimiento del jugador
    //Desactivar boton de salir al menu

    //Empieza cinematica
    this.winMusic.play("winPart");
    this.winMusic.setRate(1.5);

    //Pasa al siguiente nivel cuando se acabe la musica
    this.winMusic.scene = this;
    this.winMusic.once("complete", this.nextTower);
  }

  nextTower() {
    let towerNumber = parseInt(this.scene.key[6]);

    //Actualiza Record
    if (this.scene.game.levelsInfo[towerNumber].record === 0 ||
      Number.parseFloat(this.scene.game.levelsInfo[towerNumber].record) > Number.parseFloat(this.scene.timerString)) {
      this.scene.game.levelsInfo[towerNumber].record = this.scene.timerString;
      localStorage.setItem('Tower' + towerNumber, this.scene.timerString);
    }

    if (towerNumber < 5) {
      console.log('Tower ' + (towerNumber + 1));
      this.scene.scene.start('Tower ' + (towerNumber + 1));
    }
    else {
      this.scene.scene.start('select');
    }
  }

  lose() {
    this.music.stop();
    this.scene.start(this.key);
  }

  /**
   * Libera al jugador de la restricción con la cuerda
   */
  freePlayer() {
    this.matter.world.removeConstraint(this.ropeConstraint);
    this.ropeConstraint = undefined;
    setTimeout(this.canGrabRopeAgain, this._grabLastRopeTime, this);
  }

  /**
   * Cuando se llame a esta funcion, el jugador podra volver a agarrar la última cuerda que agarró
   * @param {Phaser.Scene} self Referencia a this para acceder a la variable
   */
  canGrabRopeAgain(self) {
    self.canGrabLastRope = true;
  }
}