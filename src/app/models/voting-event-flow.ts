import { VotingEventStep } from './voting-event-step';
import { VotingEvent } from './voting-event';

export interface VotingEventFlow {
  steps: VotingEventStep[];
}
