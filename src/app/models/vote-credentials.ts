import { VotingEvent } from './voting-event';

export interface VoteCredentials {
  voterId: { firstName?: string; lastName?: string; nickname?: string; userId?: string };
  votingEvent: VotingEvent;
}
