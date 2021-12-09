import Tower from './tower.js';

export default class Tower3 extends Tower {
  constructor() {
    super('Tower 3', 60, 6, 18,'torre3');
  }
  create(){
    super.create();
    this.isCinematicFinished = false;
    this.cameraRanges = [{"max": 4020, "min": 3445},
    {"max": 3444, "min": 2290},
    {"max": 2289, "min": 1720},
    {"max": 1719, "min":640},
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