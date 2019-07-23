import { of, asyncScheduler } from 'rxjs';
import { observeOn } from 'rxjs/operators';
import { Vote } from 'src/app/models/vote';
import { Technology } from 'src/app/models/technology';

export const VOTERS = ['First Voter', 'Second Voter', 'Third Voter', 'Fourth Voter', 'Fifth Voter'];

export class MockBackEndService {
  public votes: Vote[];
  public techsForVotingEvent: Technology[];

  getVoters() {
    // need to make it async to avoid error 'ExpressionChangedAfterItHasBeenCheckedError'
    return of(VOTERS).pipe(observeOn(asyncScheduler));
  }

  getVotesWithCommentsForTechAndEvent() {
    return of(this.votes).pipe(observeOn(asyncScheduler));
  }

  getVotingEvent() {
    const votingEvent = {
      technologies: this.techsForVotingEvent,
      name: null,
      status: 'closed',
      _id: null,
      creationTS: null,
      flow: { steps: [{ name: 'the flow', identification: { name: 'nickname' }, action: { name: 'vote' } }] }
    };
    return of(votingEvent).pipe(observeOn(asyncScheduler));
  }

  getVotes() {
    return of(null).pipe(observeOn(asyncScheduler));
  }
}
