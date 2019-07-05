export type IdentificationTypeNames = 'nickname' | 'login';
export type ActionNames = 'vote' | 'conversation' | 'recommendation';
export type TechSelectLogic = 'TechWithComments' | 'TechUncertain';

export interface VotingEventStep {
  name: string;
  description?: string;
  identification: { name: IdentificationTypeNames; roles?: string[] };
  action: { name: ActionNames; commentOnVoteBlocked?: boolean; techSelectLogic?: TechSelectLogic };
}
