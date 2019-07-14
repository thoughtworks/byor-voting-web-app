import { Comment } from './comment';

export interface VotingResults {
  votesForRing: {
    ring: string;
    count: number; // number of votes got by a certain ring on a certain Technology and Ring
  }[];
  votesForTag?: {
    tag: string;
    count: number; // number of votes which have a certain tag
  }[];
}

export interface Technology {
  _id?: string;
  id?: string;
  name: string;
  quadrant: string;
  isnew: boolean;
  description: string;
  imageFile?: string;
  forRevote?: boolean;
  comments?: Comment[];
  numberOfVotes?: number;
  numberOfComments?: number;
  votingResult?: VotingResults;
}
