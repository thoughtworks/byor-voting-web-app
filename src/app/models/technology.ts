import { Comment } from './comment';

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
}
