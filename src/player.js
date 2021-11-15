import S from './S.js'
/**
 * Clase que representa el jugador del juego. El jugador se mueve por el mundo usando los cursores.
 * También almacena la puntuación o número de estrellas que ha recogido hasta el momento.
 */
export default class Player extends Phaser.Physics.Matter.Sprite {
  
  /**
   * Constructor del jugador
   * @param {Phaser.Scene} scene Escena a la que pertenece el jugador
   * @param {number} x Coordenada X
   * @param {number} y Coordenada Y
   */
  constructor(scene, x, y) {
    super(scene.matter.world, x, y, 'player');
    let pointer = this;
    this.score = 0;
    this.scene.add.existing(this);
    this.setFixedRotation(true);
    // Queremos que el jugador no se salga de los límites del mundo
    let playerTouchingGround = false;
    this.speed = 3;

    this.wKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.aKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.dKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

    this.jumpSpeed = -12;
    // Coyote Time
    this.coyoteTime = 100;
    this.coyoteCounter = 0;
    // Jump Buffer
    this.jumpBufferLength = 100;
    this.jumpBufferCounter;
    // Check que permite ver si el jugador está en el suelo
    this.onGround = false;
    // Esta label es la UI en la que pondremos la puntuación del jugador
    this.label = this.scene.add.text(10, 10, "");
    this.cursors = this.scene.input.keyboard.createCursorKeys();
  
      
    this.scene.matter.world.on("collisionactive", (pointer, platformGroup) => {
      playerTouchingGround = true;
  }); 
    
    //escaleras
    this.brokenStair = false;
    
    this.propE = new S(this.scene,    x, y - this.height/2);
    //this.propE = this.scene.add.image(x, y - this.height/2,"brokenStair");
    this.propE.y -= this.propE.height/2;
    this.propE.depth = 6
      
  }

  /**
   * Métodos preUpdate de Phaser. En este caso solo se encarga del movimiento del jugador.
   * Como se puede ver, no se tratan las colisiones con las estrellas, ya que estas colisiones 
   * ya son gestionadas por la estrella (no gestionar las colisiones dos veces)
   * @override
   */
  preUpdate(t,dt) {
    super.preUpdate(t,dt);
      if(this.brokenStair)
          this.propE.visible = true;
      else this.propE.visible = false;
      
    // Coyote Time
    if (true){
      this.coyoteCounter = this.coyoteTime;
    }
    else {
      this.coyoteCounter = this.coyoteCounter - dt;
    }

    // Jump Buffer

    if (Phaser.Input.Keyboard.JustDown(this.cursors.up) || Phaser.Input.Keyboard.JustDown(this.wKey) || Phaser.Input.Keyboard.JustDown(this.cursors.space)) {
      this.jumpBufferCounter = this.jumpBufferLength;
    }
    else {
      this.jumpBufferCounter = this.jumpBufferCounter - dt;
    }

    if (this.jumpBufferCounter >= 0 && this.coyoteCounter > 0) {
      this.setVelocityY(this.jumpSpeed);
      console.log('jump!');
    }

    if ((this.cursors.up.isDown || this.wKey.isDown || this.cursors.space.isDown) && this.body.velocity.y < 0){
      this.setVelocityY(this.body.velocity.y * 0.9);
    }
    if (!this.playerTouchingGround && this.body.velocity.y < 0 && !(this.cursors.up.isDown || this.wKey.isDown || this.cursors.space.isDown)){
      this.setVelocityY(this.body.velocity.y * 0.6);
    }

    if (this.cursors.left.isDown || this.aKey.isDown) {
      this.setVelocityX(-this.speed);
    }
    else if (this.cursors.right.isDown || this.dKey.isDown) {
      this.setVelocityX(this.speed);
    }
    else {
      this.setVelocityX(0);
    }

    //Condicion de ganar
    if(this.y < 630)
      this.scene.win();
  }
}
