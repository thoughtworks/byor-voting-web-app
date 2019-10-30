import { of, asyncScheduler, NEVER } from 'rxjs';
import { observeOn } from 'rxjs/operators';

import { TEST_TECHNOLOGIES } from './mock-vote-service';
import { TEST_VOTING_EVENT } from './mock-voting-event';

export class MockVotingEventService {
  technologies$ = of(TEST_TECHNOLOGIES).pipe(observeOn(asyncScheduler));
  quadrants$ = of([]).pipe(observeOn(asyncScheduler));

  // selectedTechnology$ is set to NEVER so that it never emits - this to prevent that the components SelectTechForConversationComponent and
  // SelectTechForRecommendationComponent try to navigate to specific routes which are not defined in the tests
  // If for future cases we need selectedTechnology$ to actually emit we will have to define a new mock for the specific test within the test
  selectedTechnology$ = NEVER;
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
