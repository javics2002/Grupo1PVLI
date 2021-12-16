import Tower from './tower.js';

export default class Tower3 extends Tower {
  constructor() {
    super('Tower 3', 60, 6, 18,'torre3');
    this.isCinematicFinished = false;
  }
  create(){
    super.create();
    this.cameraRanges = [{"max": 4020, "min": 3460},
    {"max": 3459, "min": 2870},
    {"max": 2869, "min": 2295},
    {"max": 2294, "min": 1741},
    {"max": 1740, "min":640},
    {"max": 639, "min":0}]
  
    // Ocurre animación. Llama a judyAnimationEndCallback

    // *** Esto va dentro de judyAnimationEndCallback
    this.cameras.main.setScroll(0, 0); 
    this.cameras.main.pan(0,1500, 1000, "Sine.easeInOut", true, this.panEndCallback);
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