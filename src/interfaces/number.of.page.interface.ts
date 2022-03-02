import { OptionTypes } from '.';

export interface INumberOfPages {
  _id?: string;
  number_of_pages?: number;
  word_per_page?: string;
  type?: OptionTypes;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
}
