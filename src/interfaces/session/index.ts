import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface SessionInterface {
  id?: string;
  duration: number;
  break_time: number;
  user_id?: string;
  created_at?: any;
  updated_at?: any;

  user?: UserInterface;
  _count?: {};
}

export interface SessionGetQueryInterface extends GetQueryInterface {
  id?: string;
  user_id?: string;
}
