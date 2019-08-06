import { Roles } from './roles';

export interface Initiative {
  _id?: any;
  name: string;
  creationTS?: string;
  roles?: Roles;
}
