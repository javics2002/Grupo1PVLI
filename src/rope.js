/**
 * Cuerda que se balancea de un lado a otro. Scottie
 */
export default class Rope extends Phaser.Physics.Matter.Sprite {
    /**
     * Constructora de la cuerda
     * @param {Phaser.Scene} scene Escena a la que pertenece el jugador
     * @param {number} x Coordenada X
     * @param {number} y Coordenada Y
     * @param {integer} length Longitud de la cuerda en tiles
     * @param {number} period Tiempo que tarda en volver al mismo punto del recorrido
     * @param {number} angle Amplitud máxima de apertura
     */
    constructor(scene, x, y, length, period, angle){
        super(scene.matter.world, x, y, 'pivot');
        this.length = length;
        this.period = period;
        this.angle = angle;

        this.scene.add.existing(this);

        
        //this.setAngularVelocity(period);
    }

    /**
   * Métodos preUpdate de Phaser. Se encarga del balanceo de la cuerda.
   * @override
   */
  preUpdate(t,dt) {
    super.preUpdate(t,dt);
  }
}