import Star from './star.js';
import S from './S.js'
/**
 * Clase que representa el jugador del juego. El jugador se mueve por el mundo usando los cursores.
 * También almacena la puntuación o número de estrellas que ha recogido hasta el momento.
 */
export default class Player extends Phaser.GameObjects.Sprite {
  
  /**
   * Constructor del jugador
   * @param {Phaser.Scene} scene Escena a la que pertenece el jugador
   * @param {number} x Coordenada X
   * @param {number} y Coordenada Y
   */
  constructor(scene, x, y) {
    super(scene, x, y, 'player');
    this.score = 0;
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    // Queremos que el jugador no se salga de los límites del mundo
    this.body.setCollideWorldBounds();
    this.speed = 300;

    this.jumpSpeed = -1500;
    // Coyote Time
    this.coyoteTime = 100;
    this.coyoteCounter = 0;
    // Jump Buffer
    this.jumpBufferLength = 100;
    this.jumpBufferCounter;
    // Esta label es la UI en la que pondremos la puntuación del jugador
    this.label = this.scene.add.text(10, 10, "");
    this.cursors = this.scene.input.keyboard.createCursorKeys();
    this.updateScore();
      
      
      
      //escaleras
      this.brokenStair = false;
      
      this.propE = new S(this.scene,    x, y - this.height/2);
      //this.propE = this.scene.add.image(x, y - this.height/2,"brokenStair");
      this.propE.y -= this.propE.height/2;
      this.propE.depth = 6
      
  }

  /**
   * El jugador ha recogido una estrella por lo que este método añade un punto y
   * actualiza la UI con la puntuación actual.
   */
  point() {
    this.score++;
    this.updateScore();
  }
  
  /**
   * Actualiza la UI con la puntuación actual
   */
  updateScore() {
    this.label.text = 'Score: ' + this.score;
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
    if (this.body.onFloor()){
      this.coyoteCounter = this.coyoteTime;
    }
    else {
      this.coyoteCounter = this.coyoteCounter - dt;
    }

    // Jump Buffer
    if (Phaser.Input.Keyboard.JustDown(this.cursors.up)){
      this.jumpBufferCounter = this.jumpBufferLength;
    }
    else {
      this.jumpBufferCounter = this.jumpBufferCounter - dt;
    }

    if (this.jumpBufferCounter >= 0 && this.coyoteCounter > 0) {
      this.body.setVelocityY(this.jumpSpeed);
    }
    if (this.cursors.up.isDown && this.body.velocity.y < 0){
      this.body.setVelocityY(this.body.velocity.y * 0.9);
    }
    if (!this.body.onFloor() && this.body.velocity.y < 0 && !this.cursors.up.isDown){
      this.body.setVelocityY(this.body.velocity.y * 0.6);
    }

    if (this.cursors.left.isDown) {
      this.body.setVelocityX(-this.speed);
    }
    else if (this.cursors.right.isDown) {
      this.body.setVelocityX(this.speed);
    }
    else {
      this.body.setVelocityX(0);
    }

    if(this.y < 630)
      this.scene.win();


      this.propE.x = this.x;
      this.propE.y = this.y-(this.propE.height*2);
  }
  
}
