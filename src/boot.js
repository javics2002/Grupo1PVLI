/**
 * Escena para la precarga de los assets que se usarán en el juego.
 * Esta escena se puede mejorar añadiendo una imagen del juego y una 
 * barra de progreso de carga de los assets
 * @see {@link https://gamedevacademy.org/creating-a-preloading-screen-in-phaser-3/} como ejemplo
 * sobre cómo hacer una barra de progreso.
 */
export default class Boot extends Phaser.Scene {
  /**
   * Constructor de la escena
   */
  constructor() {
    super({ key: 'boot' });
  }

  loadFont(name, url) {
    let newFont = new FontFace(name, `url(${url})`);
    newFont.load().then(function (loaded) {
        document.fonts.add(loaded);
    }).catch(function (error) {
        return error;
    });
}

  /**
   * Carga de los assets del juego
   */
  preload() {
    //Fuentes del juego
    this.loadFont("Vertigon", "assets/fonts/Vertigon.otf");

    let width = this.cameras.main.width;
    let height = this.cameras.main.height;
    
    //Barra de progreso
    let progressBar = this.add.graphics();
    let progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(width / 2 - 160, height / 2, 320, 50);

    //Texto del loading
    let loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 30,
      text: 'Loading...',
      style: {
        font: '24px caveat',
        fill: '#ffffff'
      }
    });
    loadingText.setOrigin(0.5, 0.5);

    //Porcentaje
    let percentText = this.make.text({
      x: width / 2,
      y: height / 2 + 25,
      text: '0%',
      style: {
        font: '18px caveat',
        fill: '#ffffff'
      }
    });
    percentText.setOrigin(0.5, 0.5);

    //Información sobre el asset cargado
    let assetText = this.make.text({
      x: width / 2,
      y: height / 2 + 80,
      text: '',
      style: {
        font: '18px caveat',
        fill: '#ffffff'
      }
    });
    assetText.setOrigin(0.5, 0.5);

    // Con setPath podemos establecer el prefijo que se añadirá a todos los load que aparecen a continuación
    this.load.setPath('assets/sprites/');

    //Cargamos todos los sprites
    this.load.image('player', 'player.png');
    this.load.image('rope', 'rope.png');
    this.load.image('pivot', 'rope_pivot.png');
    this.load.image('brokenStair', 'broken_stairs1.png');
    this.load.image('smallbox','box.png');

    //Temporalmente para probar la barra de carga
    for (var i = 0; i < 0; i++) {
      this.load.image('archivo_innecesario' + i, 'player.png');
    }

    //Nos suscribimos a eventos sobre la carga de archivos
    this.load.on('progress', function (value) {
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(width / 2 - 150, height / 2 + 10, 300 * value, 30);
      percentText.setText(parseInt(value * 100) + '%');
    });

    this.load.on('fileprogress', function (file) {
      assetText.setText('Loading asset: ' + file.key);
    });

    this.load.on('complete', function () {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      percentText.destroy();
      assetText.destroy();
    });
  }

  /**
   * Creación de la escena. En este caso, solo cambiamos a la escena que representa la pantalla de título
   */
  create() {
    this.scene.start('title');
  }
}