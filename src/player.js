
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
    super(scene.matter.world, 17, 30, 'scottie_idle');
    this.scene.add.existing(this);

    this.speed = 6;

    //Salto
    this.jumpForce = -.2;
    this.lowJumpMultiplier = .01;
    this.isJumping = false;

    // Coyote Time: podemos saltar en el aire un poco después de salirnos de una plataforma
    this.coyoteTime = 100;
    this.coyoteCounter = 0;
    // Jump Buffer: podemos pulsar el botón de salto antes de tocar el suelo y saltar automáticamente en cuando lo toquemos
    this.jumpBufferLength = 100;
    this.jumpBufferCounter = 0;

    //?
    this.canClimb = false;

    //Cajas
    this.pushSpeed = this.speed * .5;
    this.isPushing = false;

    //Cuerdas
    this.hanged = false;
    this.ropeForce = 0.01;

this.puedeReparar = false;

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
    this.leftSensor = bodies.rectangle(this.x - this.width / 2, this.y, 15, this.height /2, { isSensor: true });
    this.rightSensor = bodies.rectangle(this.x + this.width / 2, this.y, 15, this.height/2 , { isSensor: true });
    this.stair = bodies.rectangle(this.x, this.y + this.height / 2-7.5, this.width / 2, 15, { isSensor: true });
    this.setExistingBody(bodies.rectangle(this.x, this.y, this.width, this.height, { chamfer: { radius: 10 } }),true);
    let compoundBody = Phaser.Physics.Matter.Matter.Body.create({
      parts: [this.body, this.bottomSensor, this.leftSensor, this.rightSensor,this.stair],
      restitution: 0.05 //Para no engancharse a las paredes
    });

    this.setExistingBody(compoundBody);
    this.setFixedRotation();

    scene.matter.world.on("beforeupdate", this.resetTouching, this);
    
    this.isTouching = { left: false, right: false};

    this.scene.matter.world.on("collisionactive", (event) => {
      for (let i = 0; i < event.pairs.length; i++) {

        let bodyA = event.pairs[i].bodyA;
        let bodyB = event.pairs[i].bodyB;

        const player = bodyA.label === 'player' ? bodyA : bodyB;
        const tile = bodyA.label === 'player' ? bodyB : bodyA;
        const mainBody = getRootBody(tile);
        const { gameObject } = mainBody;
         
        // Punto de interrupción: Comprobar bodyAs y bodyBs, ¿Se registran?
        if (bodyA === this.bottomSensor || bodyB === this.bottomSensor && tile.label !== 'escalera') {
          this.isJumping = false;
          this.coyoteCounter = this.coyoteTime;
        }
        if((bodyA === this.leftSensor&& bodyB.label === 'escalera' || bodyB === this.leftSensor&& bodyA.label === 'escalera' 
        || bodyA === this.rightSensor&& bodyB.label === 'escalera' || bodyB === this.rightSensor&& bodyA.label === 'escalera'
        || bodyA === this.stair&& bodyB.label === 'escalera' || bodyB === this.stair&& bodyA.label === 'escalera')
        )
        {
         if(tile.reparada){
          this.canClimb = true;
         }
        else if(this.puedeReparar){
            scene.mapA.replaceByIndex(3,7,tile.pX,tile.pY,2,6,scene.stairs);
            scene.mapA.replaceByIndex(4,8,tile.pX,tile.pY,2,6,scene.stairs);
            scene.mapA.replaceByIndex(5,7,tile.pX,tile.pY,2,6,scene.stairs);
            scene.mapA.replaceByIndex(6,8,tile.pX,tile.pY,2,6,scene.stairs);
            // scene.mapA.replaceByIndex(3,7,scene.mapA.getTileAtWorldXY(player.x,player.y),100,100);
            // scene.mapA.replaceByIndex(4,8,scene.mapA.getTileAtWorldXY(player.x,player.y),100,100);
            // scene.mapA.replaceByIndex(5,7,scene.mapA.getTileAtWorldXY(player.x,player.y),100,100);
            // scene.mapA.replaceByIndex(6,8,scene.mapA.getTileAtWorldXY(player.x,player.y),100,100);
            tile.reparada = true;
            this.puedeReparar = false;
          }
        }
        if(gameObject != null && gameObject.type === 'Image'&&
          (bodyA === this.leftSensor&& gameObject.label === 'fragmento' 
        || bodyB === this.rightSensor&& gameObject.label === 'fragmento' )
       ){         
          this.puedeReparar = true;
          gameObject.destroy();
        }
       
       
        if(gameObject!= null && gameObject.tile != null ){
        if (bodyA === this.leftSensor || bodyB === this.leftSensor ) {
          this.isTouching.left = true;
        }          
        else if (bodyA === this.rightSensor || bodyB === this.rightSensor){
          this.isTouching.right = true;
        }
        
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

    // this.scene.matter.world.on('collisionactive', function (event) {
    //   for (let i = 0; i < event.pairs.length; i++) {
    //     const { bodyA, bodyB } = event.pairs[i];
    //     const player = bodyA.label === 'player' ? bodyA : bodyB;
    //     const tile = bodyA.label === 'player' ? bodyB : bodyA;
    //     if (tile.isSensor) {
    //       const mainBody = getRootBody(tile);
    //       const { gameObject } = mainBody;
    //       // console.log(gameObject.tile);
    //       // console.log(player);
    //       // gameObject.tile.tint = 0x00FFFF;
    //       this.canClimb = true;


    //       if (gameObject != null&& gameObject.tile.properties.type === 'fragment') {
    //         this.brokenStair = true;
    //         gameObject.tile.visible = false;
    //       }
    //     }
    //     //else player.canClimb = false;
    //   }
    // });


    //escaleras
    this.brokenStair = false;

    //Por favor RENOMBRAR ESTO para que se entienda o al menos comentarlo
    //this.propE = new S(this.scene, x, y - this.height / 2);
    //this.propE = this.scene.add.image(x, y - this.height/2,"brokenStair");
    //this.propE.y -= this.propE.height / 2;
    //this.propE.depth = 6

    //Cargamos los sonidos que produce el jugador
    this.fix_stairs = scene.sound.add('fix_stairs');
    this.jumpSound = scene.sound.add('jump');
    this.ladder1 = scene.sound.add('ladder1');
    this.ladder2 = scene.sound.add('ladder2');
    this.pick_up = scene.sound.add('pick_up');
    this.push_box = scene.sound.add('push_box');
  }
  resetTouching() {
    this.isTouching.left = false;
    this.isTouching.right = false;
    this.isTouching.ground = false;
    this.canClimb = false;
  }
  /**
   * Métodos preUpdate de Phaser. Se encarga del control del jugador
   * @override
   */
  preUpdate(t, dt) {
  
    super.preUpdate(t, dt);

    //Controles
    if (!this.hanged) {
      if(this.isTouching.right || this.isTouching.left) this.setVelocityX(0);
      //Momiento horizontal
      if (this.right())
      {
        this.setVelocityX(this.speed);
        this.setFlipX(false);

        if(!this.isJumping && this.idling)
        {
          this.play('scottie_run');
          this.idling = false;
        }
      }
      else if (this.left())
      {
        this.setVelocityX(-this.speed);
        this.setFlipX(true);
        
        if(!this.isJumping && this.idling)
        {
          this.play('scottie_run');
          this.idling = false;
        }
      }
      if (this.right() && !this.isTouching.right)
        this.setVelocityX(this.speed * dt);
      else if (this.left()&& !this.isTouching.left)
        this.setVelocityX(-this.speed * dt);
      else
      {
        this.setVelocityX(0);

        if(!this.isJumping && !this.idling)
        {
          this.play('scottie_idle');
          this.idling = true;
        }
      }

        if(!this.canClimb){
          this.setIgnoreGravity(false);
      //Salto
      if ((this.jump() && !this.jumpDown || this.jumpBufferCounter > 0) && this.coyoteCounter > 0 && !this.isJumping) {
        this.jumpDown = true;
        this.isJumping = true;
        this.applyForce({ x: 0, y: this.jumpForce });
        this.jumpSound.play();

        //Si se ha saltado por el buffer, lo reseteamos
        if(this.jumpBufferCounter > 0)
          this.jumpBufferCounter = 0;
      }

      //Jump Buffer. Si ya estamos saltando, guardamos la pulsación en el buffer
      else if(this.jump() && !this.jumpDown && this.isJumping && this.jumpBufferCounter <= 0)
        this.jumpBufferCounter = this.jumpBufferLength;

      //Si cancelamos el salto aplica otra fuerza hacia abajo
      // //Se aplica la una velocidad ascendente hasta llegar a la altura. Sera menor cuanto más nos acerquemos a ella
      // if (this.isJumping && this.jump() && this.body.velocity.y < -1 && this.jumpInitialHeight - this.y < this.jumpHeight) 
      //   this.setVelocityY(this.jumpSpeed * (1.1 - (this.jumpInitialHeight - this.y)/this.jumpHeight) * dt);

      // //Velocidad de caida
      // else if (this.isJumping && this.body.velocity.y > -0.1)
      //   this.setVelocityY(this.body.velocity.y - this.fallMultiplier * dt);

      if (this.isJumping && this.body.velocity.y < -0.1 && !this.jump())
        this.applyForce({ x: 0, y: this.lowJumpMultiplier });

      //Solo 1 salto por pulsación
      if (!this.jump() && this.jumpDown) {
        //Soltamos el boton y por tanto se cancela la aplicación de velocidad ascendente
        this.jumpDown = false;
      }
    }
    else {
      if(this.jump()){
        this.setVelocityY(-5);
      }
      else if(this.down()){
        this.setVelocityY(7);
      }
      else{
        this.setVelocityY(0);
        this.setIgnoreGravity(true);
      }
      
    }

      //Timers
      this.coyoteCounter -= dt;
      this.jumpBufferCounter -= dt;
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
