/**
 * Jusdy
 */
 export default class Judy extends Phaser.GameObjects.Sprite {
    /**
     * Constructor de Judy
     * @param {Phaser.Scene} scene Escena a la que pertenece el jugador
     */
    constructor(scene) {
        super(scene, 17, 30, 'shadow');
        scene.add.existing(this);
        this.setPosition(1060, 572);
        this.time = 20;
        this.play("judy_idle");
    }

    fall(){

    }

    celebrate(){

    }
}