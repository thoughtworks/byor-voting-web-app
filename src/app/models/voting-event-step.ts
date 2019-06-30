export type IdentificationTypeNames = 'nickname' | 'login';
export type ActionNames = 'vote' | 'conversation' | 'recommendation';

export interface VotingEventStep {
  identification: { name: IdentificationTypeNames; role?: any };
  action: { name: ActionNames; commentOnVoteBlocked?: boolean };
}
