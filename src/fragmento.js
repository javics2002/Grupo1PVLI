export default class Frag extends Phaser.Physics.Matter.Sprite {
    /**
     * 
     * @param {Phaser.Scene} scene Escena en la que aparece la caja
     * @param {Number} x Coordenada X
     * @param {Number} y Coordenada Y
     * @param {Text} img Textura que determina la forma y el tamaño de la caja
     */
    constructor(scene, x, y, img){
        super(scene.matter.world, x, y, img);
        this.scene.add.existing(this);
        
    }
}