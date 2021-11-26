export default class Select extends Phaser.Scene {
    /**
     * Constructor de la escena
     */
    constructor() {
        super({ key: 'select' });
    }

    preload() {
        this.vertigo = this.sound.add('vertigo', this.game.audioConfig);
    }

    create() {
        let width = this.cameras.main.width;
        let height = this.cameras.main.height;

        let levelButtons = [];
        let recordText = [];
        for (let i = 0; i < 5; i++) {
            levelButtons[i] = this.add.text(width * (0.1 + i * 0.17), height * 0.2, 'Tower ' + (i + 1),
                {
                    fontFamily: 'Caveat',
                    fontSize: 50,
                    color: '#ffffff'
                }).setInteractive();
            levelButtons[i].setOrigin(0, 0.5);
            levelButtons[i].on('pointerdown', pointer => {
                this.vertigo.stop();
                this.scene.start('Tower ' + (i + 1));
            });
            levelButtons[i].setShadow(2, 2, "#333333", 2, false, true);


            recordText[i] = this.add.text(width * (0.1 + i * 0.17), height * 0.3, this.game.levelsInfo[i + 1].record,
                {
                    fontFamily: 'Caveat',
                    fontSize: 30,
                    color: '#ffffff'
                })

        }

        let backButton = this.add.text(width * 0.1, height * 0.8, 'Back to title',
            {
                fontFamily: 'Caveat',
                fontSize: 30,
                color: '#ffffff'
            }).setInteractive();
        backButton.setOrigin(0, 0.5);
        backButton.on('pointerdown', pointer => {
            this.vertigo.stop();
            this.scene.start('title');
        });
        backButton.setShadow(2, 2, "#333333", 2, false, true);

        let muteButton = this.add.text(width * 0.5, height * 0.8, 'Mute',
            {
                fontFamily: 'Caveat',
                fontSize: 30,
                color: '#ffffff'
            }).setInteractive();
        muteButton.setOrigin(0, 0.5);
        muteButton.on('pointerdown', pointer => {
            this.game.audioConfig.mute = !this.game.audioConfig.mute;
            this.vertigo.setMute(!this.vertigo.mute);
        });
        muteButton.setShadow(2, 2, "#333333", 2, false, true);

        let debugButton = this.add.text(width * 0.8, height * 0.8, 'Debug',
            {
                fontFamily: 'Caveat',
                fontSize: 30,
                color: '#ffffff'
            }).setInteractive();
        debugButton.setOrigin(0, 0.5);
        debugButton.on('pointerdown', pointer => {
            this.vertigo.stop();
            this.scene.start('Debug');
        });
        debugButton.setShadow(2, 2, "#333333", 2, false, true);


        this.vertigo.play();
    }
}