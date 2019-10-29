import { ReplaySubject } from 'rxjs';

import { Technology } from 'src/app/models/technology';
import { VotingEvent } from 'src/app/models/voting-event';
import { Credentials } from 'src/app/models/credentials';
import { TEST_VOTING_EVENT } from './mock-voting-event';

export const TEST_TECHNOLOGY = {
  id: '0001',
  name: 'Babel',
  quadrant: 'tools',
  isnew: true,
  description: 'Description of <strong>Babel</strong>',
  numberOfVotes: 1,
  numberOfComments: 2,
  votingResult: { votesForRing: [{ count: 1, ring: 'Adopt' }], votesForTag: [{ tag: 'Production', count: 1 }] }
};

export class MockAppSessionService {
  private selectedTechnology: Technology;
  selectedTechnology$ = new ReplaySubject<Technology>(1);
  private selectedVotingEvent: VotingEvent;
  private votingEvents: VotingEvent[];
  private credentials: Credentials = { nickname: 'The Nick' };

  constructor() {
    this.selectedTechnology = TEST_TECHNOLOGY;
    this.selectedVotingEvent = TEST_VOTING_EVENT;
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

  getCredentials() {
    return this.credentials;
  }
}
