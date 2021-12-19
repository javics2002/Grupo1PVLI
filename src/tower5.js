import Tower from './tower.js';

export default class Tower5 extends Tower {
  constructor() {
    super('Tower 5', 200, 10, 18,'torre5',
    [{"max": 6350, "min": 2890},
    {"max": 2889, "min": 1740},
    {"max": 1739, "min":651},
    {"max": 650, "min":0}],
    6040);
    this.isCinematicFinished = false;
  }
}