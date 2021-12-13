import Player from './player.js';
import Shadow from './shadow.js';
import Box from './box.js'
import Rope from './rope.js';
import Frag from './fragmento.js';
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
    this.music = this.sound.add('tower', this.audioConfig);
    this.winMusic = this.sound.add('win', this.audioConfig);

    this.music.addMarker(this.musicMarker);
    this.winMusic.addMarker({
      name: "winPart",
      start: 268,
      duration: 7.5
    })
  }
  
  /**
   * Creación de los elementos comunes a todas las torres
   */
  create() {
    //Tamaño del mapa
    let width = this.cameras.main.width;
    let height = this.cameras.main.height;

    this.matter.world.setBounds(0, 0, 1280, (this.floors + 1) * this.floorHeight * this.tileSize + 2 * this.margin * this.tileSize);

    this.frameTime = 0;
    this.matter.world.autoUpdate = false;

    //Tiles
    const map = this.make.tilemap({ key: this.keyTile });
   
    const tileset = map.addTilesetImage(this.keyTile, 'tiles');

    const coll = map.createLayer('Tower', tileset);
    const stairs = map.createLayer('Interactuable', tileset);
    const atravesable = map.createLayer('atravesable',tileset);
    this.stairLayer = stairs;
    //const boxes = map.createLayer('cajas',tileset);
    //console.log(boxes);
    this.mapA = map;
    this.stairs = stairs;

    // Creacion cajas desde el JSON
    if(map.getObjectLayer('cajas')!= null){
    for (const objeto of map.getObjectLayer('cajas').objects) { 
        new Box(this, objeto.x, objeto.y)     
        }
    }
    if(map.getObjectLayer('fragmentos')!= null){
      for (const objeto of map.getObjectLayer('fragmentos').objects) { 
          // let aux = new Frag(this, objeto.x, objeto.y, 'pivot',{label: 'fragmento'})  ;
          // aux.isSensor = true;
          //let rec = this.matter.add.image(objeto.x+objeto.width/2, objeto.y+objeto.height/2,"pivot",{label: 'fragmento'});
         let rec = this.matter.add.image(objeto.x+objeto.width/2, objeto.y+objeto.height/2,"pivot",{label:'fragmento'});
         rec.label = 'fragmento';
         
          rec.setSensor(true);
          rec.setStatic(true);
          }
      }
      
    
   
    
    if(map.getObjectLayer('escaleras')!= null){
      for (const objeto of map.getObjectLayer('escaleras').objects) { 
          //new Sensor(this, objeto.x, objeto.y, 'smallbox')    
          //objeto.isSensor= true;  
          
          let rec = this.matter.add.rectangle(objeto.x+objeto.width/2, objeto.y+objeto.height/2, objeto.width, objeto.height,{label : 'escalera', reparada : objeto.properties[2].value, pX : objeto.properties[0].value, pY : objeto.properties[1].value});
          rec.isStatic = true;
          rec.isSensor  = true;
          //Phaser.Physics.Matter.Matter.Bodies.rectangle(objeto.x, objeto.y , objeto.height, objeto.width);
          // let compoundBody = Phaser.Physics.Matter.Matter.Body.create({
          //   parts: [this.sens],
          //   restitution: 0.05 //Para no engancharse a las paredes
          // });
      
          // this.setExistingBody(compoundBody);  
        }
      }

    //Creacion cuerdas desde el JSON
    if(map.getObjectLayer('cuerdas')!= null){
      for (const objeto of map.getObjectLayer('cuerdas').objects) { 
          new Rope(this, objeto.x, objeto.y, objeto.properties[1].value,objeto.properties[0].value )              
          }
      }

   




    coll.setCollisionByProperty({ collides: true })
    //atravesable.setCollisionByProperty({ collides: true })
    //stairs.setCollisionByProperty({ collides: true })
    //atravesable.setCollisionByExclusion(-1, true);
    
    this.matter.world.convertTilemapLayer(coll);
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
        if (ropes.gameObject != null && ropes.gameObject.body.label != 'Rectangle Body') {
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

    
    this.shareBut = this.add.image(this.sys.game.canvas.width/2, 100, 'share')
    this.shareBut.scale = 0.2;
    this.shareBut.setInteractive();
    this.shareBut.on('pointerup' , this.clickshareScore, this);
    this.shareBut.setVisible(false);
    //this.txtShare = new Text(this, this.player.x , this.player.y, 'Share My Score', 'standard');

    //this.txtShare = this.add.text( this.player.x , this.player.y, 'Share My Score' ,{ fontFamily: 'Vertigon', fontSize: 60, color: '#e07a66' });
  }

  clickshareScore(){
    //this.events.emit('clickShareScore');
    let text = 'ola';
    let url = 'http://twitter.com/intent/tweet';
    url += '?text=' +text;

    window.open(url,'_blank')
  }

  update(t, dt) {
    super.update(t, dt);
    this.frameTime += dt;
    if ( this.frameTime > 16.5) {
      this.frameTime -= 16.5;

    if(!this._reachedTop)
    {
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

      this.shareBut.setVisible(true);

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

  nextTower()
  {
    let towerNumber = parseInt(this.scene.key[6]);

    //Actualiza Record
    if (this.scene.game.levelsInfo[towerNumber].record === 0 || 
      Number.parseFloat(this.scene.game.levelsInfo[towerNumber].record) > Number.parseFloat(this.scene.timerString)){
      this.scene.game.levelsInfo[towerNumber].record = this.scene.timerString;
      localStorage.setItem('Tower' + towerNumber,this.scene.timerString);
      }

    if (towerNumber < 5) {
      console.log('Tower ' + (towerNumber + 1));
      this.scene.scene.start('Tower ' + (towerNumber + 1));
    }
    else
    {
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