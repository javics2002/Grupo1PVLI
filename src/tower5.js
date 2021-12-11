import Tower from './tower.js';

export default class Tower5 extends Tower {
  constructor() {
    super('Tower 5', 200, 10, 18,'torre5');
    this.isCinematicFinished = false;
  }

  create(){
    super.create();
    this.cameraRanges = [{"max": 6340, "min": 2870},
    {"max": 2869, "min": 1720},
    {"max": 1719, "min":641},
    {"max": 640, "min":0}]

    // Ocurre animación. Llama a judyAnimationEndCallback

    // *** Esto va dentro de judyAnimationEndCallback
    this.cameras.main.setScroll(0, 0); 
    this.cameras.main.pan(0,6040, 1000, "Sine.easeInOut", true, this.panEndCallback);
    // ***


  }

  panEndCallback(camera = null, progress = 0){
    console.log("Se ha llamado al callback final"); // para debug
    if(progress === 1){
      // se inicia el timer
      this.hasTimerStarted = true;
      console.log("Se llama al finalizado de la fx"); // para debug
    this.isCinematicFinished = true;
    }
  }

  update(t, dt) {
    super.update(t, dt);
    if(this.isCinematicFinished === true)
    {
    this.cameraRanges.forEach(element => {
      if(this.player.y >= element.min && this.player.y < element.max){
        this.cameras.main.setBounds(0, element.min, 1280, element.max - element.min);
        this.cameras.main.startFollow(this.player);
      }
    });
    }
  }
}