import { Comment } from './comment';

export interface VotesForRing {
  ring: string;
  count: number; // number of votes got by a certain ring on a certain Technology and Ring
}
export interface VotingResults {
  votesForRing: VotesForRing[];
  votesForTag?: {
    tag: string;
    count: number; // number of votes which have a certain tag
  }[];
}
export interface Recommendation {
  author: string;
  ring?: string;
  text?: string;
  timestamp?: string;
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
  recommendandation?: Recommendation;
}

export function mostVotedRings(tech: Technology) {
  let maxVotes: VotesForRing[] = [];
  if (tech.votingResult) {
    const votes = tech.votingResult.votesForRing;
    let max = 0;
    maxVotes = votes.reduce((ringsWithMaxVotes, ring) => {
      if (max < ring.count) {
        ringsWithMaxVotes = [ring];
        max = ring.count;
      } else if (max === ring.count) {
        ringsWithMaxVotes.push(ring);
      }
      return ringsWithMaxVotes;
    }, []);
  }
  return maxVotes;
}
