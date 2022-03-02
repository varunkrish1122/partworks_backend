import { IUser, IContract } from './';

export enum Visibility {
  DELETED = 'DELETED',
  HIDDEN = 'HIDDEN',
  VISIBLE = 'VISIBLE'
}

export type RatingType = 1 | 2 | 3 | 4 | 5;

export interface Rating {
  skills: RatingType;
  work_quality: RatingType;
  availability: RatingType;
  adherence_to_schedule: RatingType;
  communication: RatingType;
  cooperation: RatingType;
}

export interface IReview {
  _id?: string;
  ratings: Rating;
  review?: string;
  visibility: Visibility;
  contract: IContract;
  feedback_by: IUser;
  feedback_to?: IUser;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
}
