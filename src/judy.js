/**
 * Jusdy
 */
 export default class Judy extends Phaser.GameObjects.Sprite {
    /**
     * Constructor de Judy
     * @param {Phaser.Scene} scene Escena a la que pertenece el jugador
     */
    constructor(scene, x, y, time) {
        super(scene, 17, 30, 'shadow');
        scene.add.existing(this);
        this.setPosition(1060, 548);
        this.fallSpeed = 20;
    }

    fall(){

    }

    celebrate(){

    }
}