import S from './BrokenStairs.js'
/**
 * El jugador. Se moverá y saltará usando los controles.
 */
export default class Player extends Phaser.Physics.Matter.Sprite {

  /**
   * Constructor del jugador
   * @param {Tower} scene Escena a la que pertenece el jugador
   * @param {number} x Coordenada X
   * @param {number} y Coordenada Y
   */
  constructor(scene, x, y) {
    super(scene.matter.world, x, y, 'player');
    let pointer = this;
    this.score = 0;
    this.scene.add.existing(this);
    this.setFixedRotation(true);

    let playerGroup = this.scene.matter.world.nextGroup(true);
    let platformGroup = this.scene.matter.world.nextGroup();
    this.setCollisionGroup(playerGroup);
    let playerTouchingGround = false;
    this.speed = 5;

    // Teclas Input: Cursors incluye flechas y espacio
    this.cursors = this.scene.input.keyboard.createCursorKeys();
    this.wKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.aKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.dKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

    this.jumpSpeed = -17;

    this.bottomSensor = Phaser.Physics.Matter.Matter.Bodies.rectangle(this.x + this.width / 2, this.y + this.height, this.width / 2, 15, { isSensor: true });

    // this.bottomSensor.setCollisionGroup(platformGroup);
    // Coyote Time
    this.coyoteTime = 100;
    this.coyoteCounter = 0;
    // Jump Buffer
    this.jumpBufferLength = 100;
    this.jumpBufferCounter;
    // Esta label es la UI en la que pondremos la puntuación del jugador
    this.label = this.scene.add.text(10, 10, "");


    this.scene.matter.world.on("collisionactive", function (event) {
      for (let i = 0; i < event.pairs.length; i++) {

        let bodyA = event.pairs[i].bodyA;
        let bodyB = event.pairs[i].bodyB;

        // Punto de interrupción: Comprobar bodyAs y bodyBs, ¿Se registran?
        if (bodyA === this.bottomSensor || bodyB === this.bottomSensor) {
          playerTouchingGround = true;
        }
      }
    });

    //escaleras
    this.brokenStair = false;

    this.propE = new S(this.scene, x, y - this.height / 2);
    //this.propE = this.scene.add.image(x, y - this.height/2,"brokenStair");
    this.propE.y -= this.propE.height / 2;
    this.propE.depth = 6

    //Cuerdas
    this.hanged = false;
    this.ropeForce = 0.01;
  }

  /**
   * Métodos preUpdate de Phaser. Se encarga del movimiento del jugador y de comprobar su altura.
   * @override
   */
  preUpdate(t, dt) {
    super.preUpdate(t, dt);
    if (this.brokenStair)
      this.propE.visible = true;
    else this.propE.visible = false;


    if (this.hanged) 
    {
      if(Phaser.Input.Keyboard.JustDown(this.cursors.up) || Phaser.Input.Keyboard.JustDown(this.wKey) || Phaser.Input.Keyboard.JustDown(this.cursors.space))
      {
        this.hanged = false;
        this.scene.freePlayer();
      }
      else
      {
        if (this.cursors.left.isDown || this.aKey.isDown) {
          this.applyForce({x: -this.ropeForce, y: 0});
        }
        else if (this.cursors.right.isDown || this.dKey.isDown) {
          this.applyForce({x: this.ropeForce, y: 0});
        }
      }
    }
    else
    {
      // Coyote Time
      if (true) {
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
        // this,playerTouchingGround = false;
        this.setVelocityY(this.jumpSpeed);
        this.setAngle(0);
        this.bottomSensor.x = this.x;
        this.bottomSensor.y = this.y;
        //console.log('jump!');
      }

      if ((this.cursors.up.isDown || this.wKey.isDown || this.cursors.space.isDown) && this.body.velocity.y < 0) {
        this.setVelocityY(this.body.velocity.y * 0.9);
      }

      if (!this.playerTouchingGround && this.body.velocity.y < 0 && !(this.cursors.up.isDown || this.wKey.isDown || this.cursors.space.isDown)) {
        this.setVelocityY(this.body.velocity.y * 0.6);
      }

      if (this.cursors.left.isDown || this.aKey.isDown) {
        this.setVelocityX(-this.speed);
        this.setAngle(0);
      }
      else if (this.cursors.right.isDown || this.dKey.isDown) {
        this.setVelocityX(this.speed);
        this.setAngle(0);
      }
      else {
        this.setVelocityX(0);
        this.setAngle(0);
      }

      this.bottomSensor.x = this.x;
      this.bottomSensor.y = this.y + this.height * 2;
    }
  }

  hangStart() {
    this.hanged = true;
  }

  hangEnd(){
    this.hanged = false;
  }
}
