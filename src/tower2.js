import Tower from './tower.js';

export default class Tower2 extends Tower {
  constructor() {
    super('Tower 2', 40, 4, 18, 'torre2');
  }
  create(){
    super.create();
    this.isCinematicFinished = false;
    this.cameraRanges = [{"max": 2868, "min": 2300},
    {"max": 2299, "min": 1715},
    {"max": 1714, "min":1140},
    {"max": 1139, "min":639},
    {"max": 630, "min":0}]

    // Ocurre animación. Llama a judyAnimationEndCallback

    // *** Esto va dentro de judyAnimationEndCallback
    this.cameras.main.setScroll(0, 0); 
    this.cameras.main.pan(0,2568, 1000, "Sine.easeInOut", true, this.panEndCallback);
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
    
    if(this.isCinematicFinished === true){
      this.cameraRanges.forEach(element => {
        if(this.player.y >= element.min && this.player.y < element.max){
            this.cameras.main.setBounds(0, element.min, 1280, element.max - element.min);
            this.cameras.main.startFollow(this.player);
        }
      });
    }
  }
}