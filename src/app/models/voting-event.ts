import { Technology } from './technology';
import { Blip } from './blip';
import { VotingEventFlow } from './voting-event-flow';

// @todo look for a better way to merge the need of specifying a union type and the need of
// providing access to the possible values of the domain via easy to read property names
export type VotingEventStatus = 'open' | 'closed';

export interface VotingEvent {
  name: string;
  status: VotingEventStatus;
  creationTS: string;
  _id: any;
  lastOpenedTS?: string;
  lastClosedTS?: string;
  technologies?: Array<Technology>;
  blips?: Array<Blip>;
  round?: number;
  openForRevote?: boolean;
  hasTechnologiesForRevote?: boolean;
  flow?: VotingEventFlow;
}
