export type IdentificationTypeNames = 'nickname' | 'login';
export type ActionNames = 'vote' | 'conversation' | 'recommendation';
export type TechSelectLogic = 'TechWithComments' | 'TechUncertain';

export interface VotingEventStep {
  name: string;
  description?: string;
  identification: { name: IdentificationTypeNames; groups?: string[] };
  action: {
    name: ActionNames;
    parameters?: {
      commentOnVoteBlocked?: boolean;
      techSelectLogic?: TechSelectLogic;
      hideVotesAndCommentNumbers?: boolean;
      tags?: string[];
      allowTagsOnVote?: boolean;
      voteOnlyOnce?: boolean; // if true the voter can vote only once and can not override the vote
      maxNumberOfVotes?: number;
    };
  };
}
