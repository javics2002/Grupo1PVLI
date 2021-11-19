export default class Select extends Phaser.Scene {
    /**
     * Constructor de la escena
     */
    constructor() {
        super({ key: 'select' });
    }

    create() {
        let width = this.cameras.main.width;
        let height = this.cameras.main.height;

        //Botones para acceder a cada uno de los niveles
        let levelButtons = [];
        for (let i = 0; i < 5; i++) {
            levelButtons[i] = this.add.text(width * (0.1 + i * 0.17), height * 0.2, 'Tower ' + (i + 1),
                {
                    fontFamily: 'Caveat',
                    fontSize: 50,
                    color: '#ffffff'
                }).setInteractive();
                levelButtons[i].setOrigin(0, 0.5);
                levelButtons[i].on('pointerdown', pointer => {
                    this.scene.start('tower' + (i + 1), {sceneName: 'tower ' + (i + 1), sceneRecord: 0});
                });
            levelButtons[i].setShadow(2, 2, "#333333", 2, false, true);
        }

        //Botón para volver a la pantalla de título
        let backButton = this.add.text(width * 0.1, height * 0.8, 'Back to title',
            {
                fontFamily: 'Caveat',
                fontSize: 30,
                color: '#ffffff'
            }).setInteractive();
            backButton.setOrigin(0, 0.5);
            backButton.on('pointerdown', pointer => {
                this.scene.start('title');
        });
        backButton.setShadow(2, 2, "#333333", 2, false, true);

        //Botón para acceder a la escena debug
        let debugButton = this.add.text(width * 0.8, height * 0.8, 'Debug',
            {
                fontFamily: 'Caveat',
                fontSize: 30,
                color: '#ffffff'
            }).setInteractive();
            debugButton.setOrigin(0, 0.5);
            debugButton.on('pointerdown', pointer => {
                this.scene.start('debug');
        });
        debugButton.setShadow(2, 2, "#333333", 2, false, true);
    }
}