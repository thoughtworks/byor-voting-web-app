import { VotingEvent } from 'src/app/models/voting-event';

export const TEST_VOTING_EVENT: VotingEvent = {
  _id: '123',
  name: 'an event',
  status: 'open',
  creationTS: 'abc',
  flow: { steps: [{ name: 'the flow', identification: { name: 'nickname' }, action: { name: 'vote' } }] }
};
