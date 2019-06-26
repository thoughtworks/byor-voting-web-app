export interface Comment {
  timestamp?: string;
  id?: string;
  // author can become an object representing the author
  author?: string;
  text: string;
  replies?: Array<Comment>;
}
