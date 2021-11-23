export default class Tower extends Phaser.Scene {
    /**
     * Constructor de la escena
     * @param {string} key Nombre de la torre
     * @param {number} defeatTime Tiempo límite para completar el nivel
     * @param {integer} floors Número de plantas de la torre, sin contar el campanario
     * @param {integer} floorHeight Número de tiles que mide un piso
     */
    constructor(key, defeatTime, floors, floorHeight) {
      super({ key: key });

        this.defeatTime = defeatTime;
        this.floors = floors;
        this.floorHeight = floorHeight;
    }
}