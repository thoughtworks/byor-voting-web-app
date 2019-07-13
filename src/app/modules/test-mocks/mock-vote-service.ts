export const TEST_TECHNOLOGIES = [
  {
    id: '0001',
    name: 'Babel',
    quadrant: 'tools',
    isnew: true,
    description: 'Description of <strong>Babel</strong>'
  },
  {
    id: '0002',
    name: 'Ember.js',
    quadrant: 'languages & frameworks',
    isnew: true,
    description: 'Description of <strong>Ember.js</strong>'
  },
  {
    id: '0003',
    name: 'Docker',
    quadrant: 'platforms',
    isnew: false,
    description: 'Description of <strong>Docker</strong>'
  },
  {
    id: '0004',
    name: 'Consumer-driven contract testing',
    quadrant: 'techniques',
    isnew: true,
    description: 'Description of <strong>Consumer-driven contract testin</strong>'
  },
  {
    id: '0005',
    name: 'LambdaCD',
    quadrant: 'tools',
    isnew: true,
    description: 'Description of <strong>LambdaCD</strong>'
  }
];

export const TEST_TECHNOLOGY = {
  id: '0001',
  name: 'Babel',
  quadrant: 'tools',
  isnew: true,
  description: 'Description of <strong>Babel</strong>'
};

export class MockVoteService {
  credentials;
  technology = TEST_TECHNOLOGY;

  constructor() {
    this.credentials = {
      voterId: null,
      votingEvent: { technologies: TEST_TECHNOLOGIES, name: null, status: 'closed', _id: null, creationTS: null }
    };
  }
}
