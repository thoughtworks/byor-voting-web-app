import { of, asyncScheduler } from 'rxjs';
import { observeOn } from 'rxjs/operators';

import { TEST_TECHNOLOGIES } from './mock-vote-service';
import { TEST_VOTING_EVENT } from './mock-voting-event';

export class MockVotingEventService {
  technologies$ = of(TEST_TECHNOLOGIES).pipe(observeOn(asyncScheduler));
  quadrants$ = of([]).pipe(observeOn(asyncScheduler));
  getSelectedVotingEvent$() {
    return of(TEST_VOTING_EVENT).pipe(observeOn(asyncScheduler));
  }
  getVotingEvent$(id: string) {
    return of(TEST_VOTING_EVENT).pipe(observeOn(asyncScheduler));
  }
  getSelectedVotingEvent() {
    return TEST_VOTING_EVENT;
  }
}
