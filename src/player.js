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
    this.scene.add.existing(this);

    this.speed = .5;

    //Salto
    this.jumpSpeed = -1.5;
    this.fallMultiplier = .05;
    this.lowJumpMultiplier = .3;
    this.jumpHeight = 7 * this.scene.tileSize;
    this.isJumping = false;

    // Coyote Time: podemos saltar en el aire un poco después de salirnos de una plataforma
    this.coyoteTime = 100;
    this.coyoteCounter = 0;
    // Jump Buffer: podemos pulsar el botón de salto antes de tocar el suelo y saltar automáticamente en cuando lo toquemos
    this.jumpBufferLength = 100;
    this.jumpBufferCounter;

    //?
    this.canClimb = false;

    //Cajas
    this.pushSpeed = this.speed * .5;
    this.isPushing = false;

    //Cuerdas
    this.hanged = false;
    this.ropeForce = 0.01;

    //Física
    this.setFixedRotation(true);

    //Input
    this.cursorsArrows = this.scene.input.keyboard.createCursorKeys();
    this.cursorsWASD = this.scene.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      jump: Phaser.Input.Keyboard.KeyCodes.SPACE
    });
    this.left = () => this.cursorsArrows.left.isDown || this.cursorsWASD.left.isDown;
    this.right = () => this.cursorsArrows.right.isDown || this.cursorsWASD.right.isDown;
    this.up = () => this.cursorsArrows.up.isDown || this.cursorsWASD.up.isDown;
    this.down = () => this.cursorsArrows.down.isDown || this.cursorsWASD.down.isDown;
    this.jump = () => this.cursorsArrows.up.isDown ||
      this.cursorsWASD.up.isDown || this.cursorsWASD.jump.isDown;

    //Control
    this.canMove = true; //Se desactiva en las cinemáticas

    /*
        let playerGroup = this.scene.matter.world.nextGroup(true);
        let platformGroup = this.scene.matter.world.nextGroup();
        this.setCollisionGroup(playerGroup);
        let playerTouchingGround = false;
    */

    //Sensores. El de abajo detecta el suelo y los de los lados, cajas
    let bodies = Phaser.Physics.Matter.Matter.Bodies;
    this.bottomSensor = bodies.rectangle(this.x, this.y + this.height / 2, this.width / 2, 15, { isSensor: true });
    this.leftSensor = bodies.rectangle(this.x - this.width / 2, this.y, 15, this.height / 2, { isSensor: true });
    this.rightSensor = bodies.rectangle(this.x + this.width / 2, this.y, 15, this.height / 2, { isSensor: true });
    let compoundBody = Phaser.Physics.Matter.Matter.Body.create({
      parts: [this.body, this.bottomSensor, this.leftSensor, this.rightSensor],
      restitution: 0.05 //Para no engancharse a las paredes
    });

    this.setExistingBody(compoundBody);

    this.scene.matter.world.on("collisionactive", (event) => {
      for (let i = 0; i < event.pairs.length; i++) {

        let bodyA = event.pairs[i].bodyA;
        let bodyB = event.pairs[i].bodyB;

        // Punto de interrupción: Comprobar bodyAs y bodyBs, ¿Se registran?
        if (bodyA === this.bottomSensor || bodyB === this.bottomSensor) {
          this.isJumping = false;
        }
      }
    });
    // this.bottomSensor.setCollisionGroup(platformGroup);

    function getRootBody(body) {
      if (body.parent === body) { return body; }
      while (body.parent !== body) {
        body = body.parent;
      }
      return body;
    }

    this.scene.matter.world.on('collisionactive', function (event) {
      for (let i = 0; i < event.pairs.length; i++) {
        const { bodyA, bodyB } = event.pairs[i];
        const player = bodyA.label === 'player' ? bodyA : bodyB;
        const tile = bodyA.label === 'player' ? bodyB : bodyA;
        if (tile.isSensor) {
          const mainBody = getRootBody(tile);
          const { gameObject } = mainBody;
          // console.log(gameObject.tile);
          // console.log(player);
          // gameObject.tile.tint = 0x00FFFF;
          this.canClimb = true;


          if (gameObject.tile.properties.type === 'fragment') {
            this.brokenStair = true;
            gameObject.tile.tint = 0x00FFFF;
          }
        }
        //else player.canClimb = false;
      }
    });

    //escaleras
    this.brokenStair = false;

    //Por favor RENOMBRAR ESTO para que se entienda o al menos comentarlo
    //this.propE = new S(this.scene, x, y - this.height / 2);
    //this.propE = this.scene.add.image(x, y - this.height/2,"brokenStair");
    //this.propE.y -= this.propE.height / 2;
    //this.propE.depth = 6
  }

  /**
   * Métodos preUpdate de Phaser. Se encarga del control del jugador
   * @override
   */
  preUpdate(t, dt) {
    super.preUpdate(t, dt);

    //Controles
    if (!this.hanged) {
      //Momiento horizontal
      if (this.right())
        this.setVelocityX(this.speed * dt);
      else if (this.left())
        this.setVelocityX(-this.speed * dt);
      else
        this.setVelocityX(0);

      //Salto
      if ((this.jump() && !this.jumpDown || this.jumpBufferCounter >= 0) /*&& this.coyoteCounter*/ > 0 && !this.isJumping) {
        this.jumpDown = true;
        this.jumpInitialHeight = this.y;
        this.isJumping = true;
        this.setVelocityY(this.jumpSpeed * dt);
      }
      if (this.isJumping && this.jump() && this.body.velocity.y < -1 && this.jumpInitialHeight - this.y < this.jumpHeight) 
        this.setVelocityY(this.jumpSpeed * (1.1 - (this.jumpInitialHeight - this.y)/this.jumpHeight) * dt);
      else if (this.isJumping && this.body.velocity.y > -0.1)
        this.setVelocityY(this.body.velocity.y - this.fallMultiplier * dt);

        //Intentos fallidos de salto que borraré cuando veais si os gusta
        /*
      else if(this.isJumping && this.body.velocity.y < -0.1 && this.jumpInitialHeight - this.y >= this.jumpHeight)
        this.setVelocityY(this.body.velocity.y + this.fallMultiplier);
      else if(this.isJumping && this.body.velocity.y > 0.1);
        //this.setVelocityY(this.body.velocity.y * 1.1);
      /*
            //Añade una fuerza complementaria hacia abajo al llegar al tope de altura y al seguir cayendo
            if (this.isJumping && (this.body.velocity.y < -0.1 && this.jumpInitialHeight - this.y > this.jumpHeight || this.body.velocity.y > 0.1 ))
              this.setVelocityY(this.body.velocity.y + this.fallMultiplier * dt);
            //Si cancelamos el salto aplica otra fuerza hacia abajo
            else if (this.isJumping && this.body.velocity.y < -0.1 && !this.jump())
              this.setVelocityY(this.body.velocity.y + this.lowJumpMultiplier * dt);
            /*
            if (this.isJumping && this.jumpInitialHeight - this.y > this.jumpHeight) {
              //Hemos llegado a la altura máxima
              this.applyForce({ x: 0, y: 0.001 });
            }
            else if (this.isJumping && !this.jump()) {
              //Aplicamos fuerza para cancelar el salto
              this.applyForce({ x: 0, y: 0.01 });
            }*/
      if (!this.jump() && this.jumpDown) {
        //Soltamos el boton
        this.jumpDown = false;
        console.log("Termino salto");
      }

/*
      if ((this.cursorsArrows.up.isDown || this.wKey.isDown || this.cursorsArrows.space.isDown) && this.body.velocity.y < 0 && !this.canClimb) {
        this.setVelocityY(this.body.velocity.y * 0.9);
      }


      if (!this.playerTouchingGround && this.body.velocity.y < 0 && !(this.cursorsArrows.up.isDown || this.wKey.isDown || this.cursorsArrows.space.isDown)) {
        this.setVelocityY(this.body.velocity.y * 0.6);
      }
*/
      // Coyote Time
      /*
      if (true) {
        this.coyoteCounter = this.coyoteTime;
      }
      else {
        this.coyoteCounter = this.coyoteCounter - dt;
      }*/

      // Jump Buffer
/*
      if (Phaser.Input.Keyboard.JustDown(this.cursorsArrows.up) || Phaser.Input.Keyboard.JustDown(this.wKey) || Phaser.Input.Keyboard.JustDown(this.cursorsArrows.space)) {
        this.jumpBufferCounter = this.jumpBufferLength;
      }
      else {
        this.jumpBufferCounter = this.jumpBufferCounter - dt;
      }

      this.bottomSensor.x = this.x;
      this.bottomSensor.y = this.y + this.height * 2*/;
    }

    //Controles agarrado a una cuerda
    else {
      if (this.jump()) {
        this.hanged = false;
        this.scene.freePlayer();
      }
      else if (this.left())
        this.applyForce({ x: -this.ropeForce, y: 0 });
      else if (this.right())
        this.applyForce({ x: this.ropeForce, y: 0 });
    }
    /*
        if (this.brokenStair)
          this.propE.visible = true;
        else this.propE.visible = false;*/
  }

  hangStart() {
    this.hanged = true;
  }

  hangEnd() {
    this.hanged = false;
  }
}
