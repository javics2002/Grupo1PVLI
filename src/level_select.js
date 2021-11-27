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

        //Columnas, una para cada nivel
        let towerNames = [];
        let towerPreviews = [];
        let recordText = [];
        let playButtons = [];
        for (let i = 0; i < 5; i++) {
            //Fondo
            let column = this.add.graphics();
            column.fillStyle(0x222222, 0.8);
            column.fillRect(90 + i * 224, 50, 204, 530);

            //Nombre de la torre
            towerNames[i] = this.add.text(90 + 100 + i * 224, 100, ' Tower ' + (i + 1) + " ",
                {
                    fontFamily: 'Caveat',
                    fontSize: 50,
                    color: '#f3463a'
                });
            towerNames[i].setOrigin(0.5, 0.5);
            towerNames[i].setShadow(2, 2, "#333333", 2, false, true);

            //Preview de la torre
            towerPreviews[i] = this.add.image(90 + 100 + i * 224, 450, "tower" + (i + 1) + "preview");
            towerPreviews[i].setOrigin(.5, 1);
            towerPreviews[i].setScale(0.05);

            //Récord
            recordText[i] = this.add.text(90 + 100 + i * 224, 470,
                "Record: " + this.game.levelsInfo[i + 1].record + " s",
                {
                    fontFamily: 'Caveat',
                    fontSize: 18,
                    color: '#D6D45A'
                });
            recordText[i].setOrigin(0.5, 0.5);
            if (recordText[i].text === "Record: 0 s")
            {
                recordText[i].setColor('#838383');
                recordText[i].text = "No data";
            }

            //Botón de PLAY
            playButtons[i] = this.add.text(90 + 100 + i * 224, 530, " PLAY ",
                {
                    fontFamily: 'Caveat',
                    fontSize: 40,
                    color: '#ffffff'
                }).setInteractive();
            playButtons[i].setOrigin(0.5, 0.5);
            playButtons[i].on('pointerdown', pointer => {
                this.vertigo.stop();
                this.scene.start('Tower ' + (i + 1));
            });
            playButtons[i].setShadow(2, 2, "#f3463a", 2, false, true);
        }

        //Boton para volver a la pantalla de título
        let backButton = this.add.text(90, height - 50, 'Back to title ',
            {
                fontFamily: 'Caveat',
                fontSize: 30,
                color: '#ffffff'
            }).setInteractive();
        backButton.setOrigin(0, 1);
        backButton.on('pointerdown', pointer => {
            this.vertigo.stop();
            this.scene.start('title');
        });
        backButton.setShadow(2, 2, "#333333", 2, false, true);

        //Mute
        let muteButton = this.add.text(width * 0.5, height - 50, ' Mute ',
            {
                fontFamily: 'Caveat',
                fontSize: 30,
                color: '#ffffff'
            }).setInteractive();
        muteButton.setOrigin(0.5, 1);
        muteButton.on('pointerdown', pointer => {
            this.game.audioConfig.mute = !this.game.audioConfig.mute;
            this.vertigo.setMute(!this.vertigo.mute);
        });
        muteButton.setShadow(2, 2, "#333333", 2, false, true);

        //Fullscreen
        let fullscreenButton = this.add.text(width - 90, height - 50, 'Fullscreen',
            {
                fontFamily: 'Caveat',
                fontSize: 30,
                color: '#ffffff'
            }).setInteractive();
        fullscreenButton.setOrigin(1, 1);
        fullscreenButton.on('pointerdown', pointer => {
            if (this.scale.isFullscreen) 
                this.scale.stopFullscreen();
            else
                this.scale.startFullscreen();
        });
        fullscreenButton.setShadow(2, 2, "#333333", 2, false, true);

        /*
        //Debug, no apto para release
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
        */

        //Música
        
        this.vertigo.play();
    }
}