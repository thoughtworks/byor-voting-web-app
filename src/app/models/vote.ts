import { Technology } from './technology';
import { Comment } from './comment';
import { Credentials } from './credentials';

export interface Vote {
  _id?: string;
  ring: string;
  technology: Technology;
  voterId?: Credentials;
  eventRound?: any;
  comment?: Comment;
  tags?: string[];
}
