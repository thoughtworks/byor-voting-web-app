export interface Technology {
  _id?: string;
  id?: string;
  name: string;
  quadrant: string;
  isnew: boolean;
  description: string;
  imageFile?: string;
  forRevote?: boolean;
}
