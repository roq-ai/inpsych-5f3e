import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface PlaylistInterface {
  id?: string;
  genre: string;
  user_id?: string;
  created_at?: any;
  updated_at?: any;

  user?: UserInterface;
  _count?: {};
}

export interface PlaylistGetQueryInterface extends GetQueryInterface {
  id?: string;
  genre?: string;
  user_id?: string;
}
