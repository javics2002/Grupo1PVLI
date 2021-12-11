import Tower from './tower.js';

export default class Tower1 extends Tower {
  constructor() {
    super('Tower 1', 20, 2, 18,'torre1');
    this.isCinematicFinished = false;
    this.isThisFirstTime = true;
  }

  create()
  {
    super.create();
    this.cameraRanges = [{"max": 1721, "min": 1145},
    {"max": 1146, "min":636},
    {"max": 635, "min":0}];

    if(this.isThisFirstTime){
    // Ocurre animación. Llama a judyAnimationEndCallback
    
    // *** Esto va dentro de judyAnimationEndCallback
    this.cameras.main.setScroll(0, 0); 
    this.cameras.main.pan(0,1500, 1000, "Sine.easeInOut", true, this.panEndCallback);
    // ***
  }
  }


  panEndCallback(camera = null, progress = 0){
    console.log("Se ha llamado al callback final"); // para debug
    if(progress === 1){
      this.hasTimerStarted = true;
      console.log("Se llama al finalizado de la fx"); // para debug
    this.isCinematicFinished = true;
    this.isThisFirstTime = false;
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