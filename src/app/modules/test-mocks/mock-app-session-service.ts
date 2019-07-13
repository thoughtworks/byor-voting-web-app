import { Technology } from 'src/app/models/technology';
import { VotingEvent } from 'src/app/models/voting-event';

export const TEST_TECHNOLOGY = {
  id: '0001',
  name: 'Babel',
  quadrant: 'tools',
  isnew: true,
  description: 'Description of <strong>Babel</strong>'
};

export class MockAppSessionService {
  private selectedTechnology: Technology;
  private selectedVotingEvent: VotingEvent;
  private votingEvents: VotingEvent[];

  constructor() {
    this.selectedTechnology = TEST_TECHNOLOGY;
    this.selectedVotingEvent = {
      _id: '123',
      name: 'an event',
      status: 'open',
      creationTS: 'abc',
      flow: { steps: [{ name: 'the flow', identification: { name: 'nickname' }, action: { name: 'vote' } }] }
    };
    this.votingEvents = [
      {
        _id: '123',
        name: 'an event',
        status: 'open',
        creationTS: 'abc',
        flow: { steps: [{ name: 'the flow', identification: { name: 'nickname' }, action: { name: 'vote' } }] }
      }
    ];
  }

  getSelectedTechnology() {
    return this.selectedTechnology;
  }

  getSelectedVotingEvent() {
    return this.selectedVotingEvent;
  }

  getVotingEvents() {
    return this.votingEvents;
  }
}
