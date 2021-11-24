import Tower from './tower.js';

export default class Tower1 extends Tower {
  constructor() {
    super('Tower 1', 20, 2, 18);
  }

  create()
  {
    super.create();

    const ropes = this.matter.world.nextCategory();
    this.cameraRanges = [{"max": 860, "min": 0},
    {"max": 1720, "min": 861}]
  }

  update(t, dt) {
    super.update(t, dt);
  }
}