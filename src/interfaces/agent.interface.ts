import { ICommonUser, IUser, ISeller } from './';

export interface IAgent extends ICommonUser, ISeller {
  amount: number;
  company_name?: string;
  company_description?: string;
  service?: { title?: string; description?: string };
  company_logo?: string;
  user: IUser;
}
