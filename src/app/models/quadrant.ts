import { Blip } from './blip';
export class Quadrant {
  private blips = new Array<Blip>();

  constructor(public name: string) {}

  addBlip(blip: Blip) {
    this.blips.push(blip);
  }
  getBlips() {
    return this.blips;
  }
}
