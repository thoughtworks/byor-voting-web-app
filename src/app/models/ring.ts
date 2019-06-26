import { Blip } from './blip';
export class Ring {
    private blips = new Array<Blip>();

    constructor(
        public name: string,
    ) { }

    addBlip(blip: Blip) {
        this.blips.push(blip);
    }
    getBlips() {
        return this.blips;
    }
}

export class TwRings {
    private static DEFINITIONS = [
        { name: 'Adopt', description: 'We feel strongly that the industry should be adopting these items. We use them when appropriate on our projects.' },
        { name: 'Trial', description: 'Worth pursuing. It’s important to understand how to build up this capability. Enterprises can try this technology on a project that can handle the risk.' },
        { name: 'Assess', description: 'Worth exploring with the goal of understanding how it will affect your enterprise.' },
        { name: 'Hold', description: 'Proceed with caution.' }
    ];
    private static NAMES;
    private static DESCRIPTIONS;

    static get names(): string[] {
        if (!this.NAMES) {
            this.NAMES = this.DEFINITIONS.map(ring => ring.name);
        }
        return this.NAMES;
    }

    static get descriptions(): string[] {
        if (!this.DESCRIPTIONS) {
            this.DESCRIPTIONS = this.DEFINITIONS.map(ring => ring.description);
        }
        return this.DESCRIPTIONS;
    }

    static get definitions() {
        return this.DEFINITIONS;
    }
}
