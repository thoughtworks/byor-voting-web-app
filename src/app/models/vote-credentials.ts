
import {VotingEvent} from './voting-event';

export interface VoteCredentials {
    voterId: {firstName: string, lastName: string};
    votingEvent: VotingEvent;
}
