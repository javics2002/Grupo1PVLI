/**
 * Sombra del asesino que subirá a tirar a Judy en cuanto se acabe el tiempo.
 * Su altura marca cuánto tiempo le falta.
 */
export default class Shadow extends Phaser.GameObjects.Sprite {
    /**
       * Constructor de la sombra
       * @param {Phaser.Scene} scene Escena a la que pertenece el jugador
       * @param {number} x Coordenada X
       * @param {number} y Coordenada Y
       * @param {number} time Tiempo que tardará en llegar a lo alto
       */
    constructor(scene, x, y, time) {
        super(scene, x, y, 'shadow');
        this.scene = scene;
        this.scene.add.existing(this);
        
        this.time = time;

        this.tween = this.scene.tweens.add({
            targets: [this],
            y: (this.scene.floorHeight + this.scene.margin) * this.scene.tileSize,
            duration: this.time * 1000//,
            //ease: 'Sine.easeOut'
        });

        this.tween.on('stop', this.kill);
    }

    kill()
    {
        console.log('La sombra ha llegado arriba');
    }

    stop()
    {
        this.tween.pause();
    }
}