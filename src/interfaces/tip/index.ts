import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface TipInterface {
  id?: string;
  content: string;
  user_id?: string;
  created_at?: any;
  updated_at?: any;

  user?: UserInterface;
  _count?: {};
}

export interface TipGetQueryInterface extends GetQueryInterface {
  id?: string;
  content?: string;
  user_id?: string;
}
