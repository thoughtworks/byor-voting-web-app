import { VotingEvent } from 'src/app/models/voting-event';

export class MockEventService {
  selectedVotingEvent: VotingEvent;

  constructor() {
    this.selectedVotingEvent = {
      _id: '123',
      creationTS: 'now',
      name: 'mock-voting-event',
      status: 'open'
    };
  }

  getSelectedEvent() {
    return this.selectedVotingEvent;
  }
}
