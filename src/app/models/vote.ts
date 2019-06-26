import { Technology } from './technology';
import { Comment } from './comment';

export interface Vote {
  ring: string;
  technology: Technology;
  eventRound?: any;
  comment?: Comment;
}
