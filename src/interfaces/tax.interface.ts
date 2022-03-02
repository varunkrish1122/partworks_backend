import { IUser } from './';

export interface ITax {
  name?: string;
  country: string;
  street_address?: string;
  city?: string;
  postal_code?: string;
  classification?: string;
  user: IUser;
}
