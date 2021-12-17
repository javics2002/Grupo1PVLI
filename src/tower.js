import Player from './player.js';
import Shadow from './shadow.js';
import Box from './box.js'
import Rope from './rope.js';
import Frag from './fragmento.js';
import Judy from './judy.js';
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
    super({
      key: key
    });
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
  }

  preload() {
    this.loadMusic();
  }

  create() {
    this.frameTime = 0;
    this.matter.world.autoUpdate = false;

    let width = this.cameras.main.width;
    let height = this.cameras.main.height;

    //Tamaño del mapa
    this.matter.world.setBounds(0, 0, 1280, (this.floors + 1) * this.floorHeight * this.tileSize + 2 * this.margin * this.tileSize);

    this.buildTower();

    //Animaciones
    this.createAnimation('scottie_idle', 153);
    this.createAnimation('scottie_run', 16);
    this.createAnimation('scottie_run_jump', 4);
    this.createAnimation('scottie_run_jump', 6);
    this.createAnimation('scottie_climb', 8);
    this.createAnimation('scottie_push', 11);
    this.createAnimation('scottie_jump', 1);
    this.createAnimation('scottie_hang', 1);
    this.createAnimation('shadow_rise', 6, true);
    this.createAnimation('judy_idle', 8);
    this.createAnimation('judy_fall', 1);

    //Personajes
    this.player = new Player(this, 400, (this.floors + 1) * this.floorHeight * this.tileSize);
    this.judy = new Judy(this);
    this.judy.play("judy_idle");
    this.shadow = new Shadow(this, 200, (this.floors + 1) * this.floorHeight * this.tileSize, this.defeatTime);
    this.shadow.play("shadow_rise");

    //Timer
    this.timer = 0;

    //Camara
    this.cameras.main.setBounds(0, 0, 1280, (this.floors + 1) * this.floorHeight * 32 + 32 * 4);
    this.cameras.main.startFollow(this.player);

    this.ropeConstraint = undefined;

    //Agarrarse a la cuerda
    this.onGrabRope();

    //UI
    // Botón de mute
    let mute = this.game.audioConfig.mute ? 'mute_on' : 'mute_off';
    this.addInterfaceButton(width * 0.05, height * 0.2, mute, 32, function () {
      this.scene.game.audioConfig.mute = !this.scene.game.audioConfig.mute;
      this.scene.music.setMute(!this.scene.music.mute);
      this.setTexture(this.scene.game.audioConfig.mute ? 'mute_on' : 'mute_off');
    });

    // Botón volver a SelectScreen
    this.backButton = this.addInterfaceButton(width * 0.05, height * 0.08, 'exit_icon', 50, function () {
      this.scene.music.stop();
      this.scene.scene.start('select');
    });

    // Texto del nombre de la escena: "Torre i"
    let rigthMargin = width - width * 0.05;
    this.addInterfaceText(rigthMargin, height * 0.05, this.key, 50, '#ffffff');

    // Cronómetro
    this.timerText = this.addInterfaceText(rigthMargin, height * 0.12, this.timer.toString(), 50, '#ffffff');

    // Límite de tiempo con dos decimales
    this.defeatTimeString = this.defeatTime.toFixed(2);
    this.defeatTimeText = this.addInterfaceText(rigthMargin, height * 0.17, this.defeatTimeString + " ", 30, '#ff0000');

    //Flechas de marca para la sombra
    this.upArrow = this.addInterfaceImage(this.shadow.x, 32, "up_arrow", {
      x: 0.5,
      y: 0
    }, 0Xf3463a);
    this.downArrow = this.addInterfaceImage(this.shadow.x, height - 32, "down_arrow", {
      x: 0.5,
      y: 1
    }, 0Xffffff)

    //Música
    this.music.play(this.key);
    this.music.setRate(1.5);
    this.music.setMute(this.game.audioConfig.mute);

    //Reseteamos el haber llegado a la cima
    this._reachedTop = false;
  }

  update(t, dt) {
    super.update(t, dt);
    this.frameTime += dt;
    //console.log("Altura del jugador: " + this.player.y);

    //Cronómetro
    if (!this._reachedTop && this.hasTimerStarted)
      this.updateTimer(dt);

    //Limitamos forzosamente el framerate a 60fps y los acompasamos con los pasos físicos (por problemas técnicos)
    if (this.frameTime > 16.5) {
      this.frameTime -= 16.5;
      //Actualizar flechas de la sombra
      this.downArrow.setVisible(!this._reachedTop && this.cameras.main.scrollY + this.cameras.main.height < this.shadow.y);
      this.upArrow.setVisible(!this._reachedTop && this.cameras.main.scrollY > this.shadow.y);

      //Condicion de ganar
      if (!this._reachedTop && this.player.y < this.tileSize * (this.floorHeight + this.margin))
        this.win();

      this.matter.world.step();
    }
  }

  updateTimer(dt) {
    this.timer = this.timer + dt / 1000;

    // Dos decimales
    this.timerString = this.timer.toFixed(2);
    this.timerText.setText(this.timerString + " ");

    if (this.timer > this.defeatTime)
      this.lose();
  }

  loadMusic() {
    //La sombrá llegará a Judy cuando la música "tower" llegue a estos segundos
    this._loseMusicTime = 320;
    this._startMusicTime = this._loseMusicTime - (this.defeatTime * 1.5);

    this.musicMarker = {
      name: this.key,
      start: this._startMusicTime,
      duration: this.defeatTime * 1.5 + 5
    };

    //Cargamos la musica
    this.music = this.sound.add('tower', this.game.audioConfig);
    this.winMusic = this.sound.add('win', this.game.audioConfig);

    this.music.addMarker(this.musicMarker);
    this.winMusic.addMarker({
      name: "winPart",
      start: 268,
      duration: 7.5
    });

    //Cargamos los sonidos
    this.help_me = this.sound.add('help_me');
    this.fall = this.sound.add('fall');
    this.scream = this.sound.add('scream');
    this.thump = this.sound.add('thump');
  }

  buildTower() {
    //Tiles
    const map = this.make.tilemap({
      key: this.keyTile
    });

    const tileset = map.addTilesetImage(this.keyTile, 'tiles');

    this.coll = map.createLayer('Tower', tileset);
    const stairs = map.createLayer('Interactuable', tileset);
    const atravesable = map.createLayer('atravesable', tileset);
    this.stairLayer = stairs;
    //const boxes = map.createLayer('cajas',tileset);
    //console.log(boxes);
    this.mapA = map;
    this.stairs = stairs;

    // Creacion cajas desde el JSON
    if (map.getObjectLayer('cajas') != null) {
      for (const objeto of map.getObjectLayer('cajas').objects) {
        new Box(this, objeto.x, objeto.y)
      }
    }
    if (map.getObjectLayer('fragmentos') != null) {
      for (const objeto of map.getObjectLayer('fragmentos').objects) {
        // let aux = new Frag(this, objeto.x, objeto.y, 'pivot',{label: 'fragmento'})  ;
        // aux.isSensor = true;
        //let rec = this.matter.add.image(objeto.x+objeto.width/2, objeto.y+objeto.height/2,"pivot",{label: 'fragmento'});
        let rec = this.matter.add.image(objeto.x + objeto.width / 2, objeto.y + objeto.height / 2, "pivot", {
          label: 'fragmento'
        });
        rec.label = 'fragmento';

        rec.setSensor(true);
        rec.setStatic(true);
      }
    }
    if (map.getObjectLayer('escaleras') != null) {
      for (const objeto of map.getObjectLayer('escaleras').objects) {
        //new Sensor(this, objeto.x, objeto.y, 'smallbox')    
        //objeto.isSensor= true;  

        let rec = this.matter.add.rectangle(objeto.x + objeto.width / 2, objeto.y + objeto.height / 2, objeto.width, objeto.height, {
          label: 'escalera',
          reparada: objeto.properties[2].value,
          pX: objeto.properties[0].value,
          pY: objeto.properties[1].value
        });
        rec.isStatic = true;
        rec.isSensor = true;
        //Phaser.Physics.Matter.Matter.Bodies.rectangle(objeto.x, objeto.y , objeto.height, objeto.width);
        // let compoundBody = Phaser.Physics.Matter.Matter.Body.create({
        //   parts: [this.sens],
        //   restitution: 0.05 //Para no engancharse a las paredes
        // });

        // this.setExistingBody(compoundBody);  
      }
    }
    //Creacion cuerdas desde el JSON
    if (map.getObjectLayer('cuerdas') != null) {
      for (const objeto of map.getObjectLayer('cuerdas').objects) {
        new Rope(this, objeto.x, objeto.y, objeto.properties[1].value, objeto.properties[0].value)
      }
    }
    this.coll.setCollisionByProperty({
      collides: true
    })
    //atravesable.setCollisionByProperty({ collides: true })
    //stairs.setCollisionByProperty({ collides: true })
    //atravesable.setCollisionByExclusion(-1, true);

    this.matter.world.convertTilemapLayer(this.coll);
    //this.matter.world.convertTilemapLayer(atravesable);
    //this.matter.world.convertTilemapLayer(stairs);
    const tileCollisions = [0, 1, 2, 3]
    //   atravesable.layer.data.forEach(function (row){
    //     row.forEach(function (tile) {
    //     if (tileCollisions.includes(tile.index)) {
    //       tile.collideDown = false
    //       tile.collideLeft = false
    //       tile.collideRight = false
    //       tile.collideUp = true
    //       // or less verbosely:
    //       // tile.setCollision(false, false, true, false)
    //     }
    //   })
    // })

    // atravesable.forEachTile((tile) => {


    //     tile.setCollision(false, false, true, false, true);



    //   }, this);

    // stairs.forEachTile(function (tile) {
    //     //If your ladder tiles have a complex body made up of different parts, you'll need to iterate through
    //     //each part. If it's a simple rectangle, it will only have 1 part which is a reference to itself
    //     if (tile.properties.type === 'ladder') {
    //      console.log(tile.index)
    //       };
    //     });

    // stairs.forEachTile(function (tile) {
    //   // If your ladder tiles have a complex body made up of different parts, you'll need to iterate through
    //   // each part. If it's a simple rectangle, it will only have 1 part which is a reference to itself
    //   // if (tile.properties.type === 'ladder') {
    //   //   tile.physics.matterBody.body.parts.forEach((part) => {
    //   //     part.isSensor = true;
    //   //   });
    //   // }
    //  if (tile.properties.type === 'fragment') {
    //     tile.physics.matterBody.body.parts.forEach((part) => {
    //       part.isSensor = true;
    //     });
    //   }
    // });    
  }

  /**
   * Se ejecuta al llegar a la cima de la torre.
   */
  win() {
    this._reachedTop = true;

    //Eliminamos UI
    this.backButton.destroy(true);
    this.timerText.setColor("#D6D45A");
    this.defeatTimeText.destroy(true);

    //Paramos la musica y la sombra
    this.music.stop();
    this.shadow.stop();

    //Desactivar movimiento del jugador

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
    } else {
      this.scene.scene.start('select');
    }
  }

  /**
   * Se ejecuta al acabarse el tiempo.
   */
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
    self._canGrabLastRope = true;
  }

  onGrabRope() {
    this.matter.world.on('collisionstart', (event) => {
      for (let i = 0; i < event.pairs.length; i++) {
        let bodyA = getRootBody(event.pairs[i].bodyA);
        let bodyB = getRootBody(event.pairs[i].bodyB);

        const player = bodyA.gameObject instanceof Player ? bodyA : bodyB;
        const ropes = bodyA.gameObject instanceof Player ? bodyB : bodyA;

        //Puede que ya estemos agarrados a un nodo
        if (player.gameObject instanceof Player && ropes.label === "rope" && this.ropeConstraint === undefined) {
          //Para permitir el salto de una cuerda a otra, 
          //evitaremos engancharnos a otros nodos de la cuerda que acabamos de soltar
          if (this._lastRopeId !== ropes.gameObject.id || this._canGrabLastRope) {
            this.ropeConstraint = this.matter.add.constraint(player,
              ropes,
              0,
              0.5 // rigidez de la unión
            );

            this._canGrabLastRope = false;
            this._lastRopeId = ropes.gameObject.id;
            this.player.changeHang(true);
          }
        }
      }

      function getRootBody(body) {
        if (body.parent === body) {
          return body;
        }
        while (body.parent !== body) {
          body = body.parent;
        }
        return body;
      }
    });
  }

  /**
   * Añade una animación a la escena
   * @param {string} animation_name Nombre de la animación. Debe ser el mismo con el que se cargó su spritesheet
   * @param {integer} num_frames Número de frames de la animación
   */
  createAnimation(animation_name, num_frames, slow = false) {
    this.anims.create({
      key: animation_name,
      frames: this.anims.generateFrameNumbers(animation_name, {
        start: 0,
        end: num_frames - 1
      }),
      frameRate: slow ? 8 : 24,
      repeat: -1
    });
  }

  /**
   * Crea un botón en la interfaz de usuario
   * @param {integer} x Posición en el eje X (esquina superior izquierda)
   * @param {integer} y Posición en el eje Y (esquina superior izquierda)
   * @param {string} textureName Nombre de la textura del botón. Debe ser la misma con la que se cargó.
   * @param {integer} size Tamaño de la textura. Necesaria para la hit area del botón.
   * @param {function} buttonAction Función que se realiza al pulsar el botón
   * @returns Devuelve el elemento de la interfaz para poder modificarlo
   */
  addInterfaceButton(x, y, textureName, size, buttonAction) {
    let button = this.add.sprite(x, y, textureName)
      .setInteractive(new Phaser.Geom.Rectangle(size / 2, size / 2, size, size), Phaser.Geom.Rectangle.Contains);
    button.setOrigin(0, 0);
    button.setScrollFactor(0);

    button.on('pointerdown', buttonAction);

    return button;
  }

  /**
   * Crea un texto en la interfaz de usuario
   * @param {integer} x Posición en el eje X (esquina superior derecha)
   * @param {integer} y Posición en el eje Y (esquina superior derecha)
   * @param {string} s Texto a escribir en el elemento de la interfaz
   * @param {integer} size Tamaño del texto en px
   * @param {string} color Color del texto. Se trata de un string con el código RGB del mismo ('#XXXXXX')
   * @returns Devuelve el elemento de la interfaz para poder modificarlo
   */
  addInterfaceText(x, y, s, size, color) {
    let text = this.add.text(x, y, s, {
      fontFamily: 'Caveat',
      fontSize: size,
      color: color,
      align: 'right'
    });
    text.setOrigin(1, 0);
    text.setScrollFactor(0);

    return text;
  }

  /**
   * Crea una imagen en la interfaz de usuario
   * @param {*} x Posición en el eje X
   * @param {*} y Posición en el eje Y
   * @param {*} textureName Nombre de la textura del botón. Debe ser la misma con la que se cargó.
   * @param {object} origin Origen de la textura. Es un objeto con numbers x e y, entre 0 y 1.
   * @param {number} tint Número hexadecimal del código del color de la tinta. 0Xffffff no tintará la imagen
   * @returns Devuelve el elemento de la interfaz para poder modificarlo
   */
  addInterfaceImage(x, y, textureName, origin, tint) {
    let image = this.add.image(x, y, textureName);
    image.setScrollFactor(0);
    image.setOrigin(origin.x, origin.y);
    image.setTint(tint);

    return image;
  }
}