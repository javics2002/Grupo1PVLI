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
        this.scene = scene;
        this.setPosition(1050, 572);
        this.time = 700;
        this.play("judy_idle");
        this.scream = scene.sound.add('scream');
        this.fall_sound = scene.sound.add('fall');
        this.thump = scene.sound.add('thump');
    }

    fall(){
        this.setPosition(1150, 572)
        this.scream.play();
        this.fall_sound.play();
        this.play("judy_fall");

        this.tween = this.scene.tweens.add({
            targets: [this],
            y: (this.scene.floorHeight * (this.scene.floors + 1)) * this.scene.tileSize,
            angle: 500 * this.scene.floors,
            duration: this.time * this.scene.floors,
            ease: "Quad.easeIn",
            onComplete: ()=>{
                this.thump.play();
                this.thump.once("complete", ()=>{
                    this.scene.repeat();
                });
            }
        });
    }

    celebrate(){
        
    }
}