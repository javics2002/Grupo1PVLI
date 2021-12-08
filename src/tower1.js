import CameraManager from './cameramanager.js';
import Tower from './tower.js';

export default class Tower1 extends Tower {
  constructor() {
    super('Tower 1', 20, 2, 18,'torre1');
    this.isCinematicFinished = false;
  }

  create()
  {
    
    super.create();
    this.cameraRanges = [{"max": 1721, "min": 1145},
    {"max": 1146, "min":636},
    {"max": 635, "min":0}];
    this.cameras.main.pan(0, 235, 1500, "Sine.easeInOut", true, this.upwardPanCallback);
  }

  upwardPanCallback(camera = null, progress = 0){
    console.log("Se ha llamado al callback");
    if(progress === 1){
      // La animación de Judy iría aquí, cuando esté programada hay que hacer un callback distinto para el panDownwards
      console.log("El panning anterior ha terminado");
      // no consigo que funcione el segundo pan, si ves esto es que el jueves no me ha dado tiempo a acabarlo
      camera.pan(0,1721, 1000, "Sine.easeInOut");
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