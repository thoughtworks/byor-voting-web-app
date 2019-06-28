import { Technology } from './technology';
import { Comment } from './comment';

export interface Vote {
  _id?: string;
  ring: string;
  technology: Technology;
  eventRound?: any;
  comment?: Comment;
}
