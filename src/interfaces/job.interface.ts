import {
  ICoupon,
  ICategory,
  IService,
  IDocument,
  ISchool,
  ISubject,
  IUser
} from './';

export enum TutorChosenBy {
  STUDENT = 'STUDENT',
  ADMIN = 'ADMIN'
}

export enum JobStatus {
  HIRED = 'HIRED',
  OPEN = 'OPEN',
  CLOSED = 'CLOSED'
}

export interface IJob {
  _id?: string;
  budget: number;
  tip?: number;
  languages?: string[];
  title?: string;
  description?: string;
  course_name?: string;
  coupon?: ICoupon;
  deadline_date?: string;
  deadline_time?: string;
  start_date?: Date;
  end_date?: Date;
  exam_length?: number;
  exam_date?: Date;
  exam_time?: string;
  time_zone?: string;
  grad_level?: string;
  school?: ISchool;
  documents?: IDocument[];
  number_of_pages?: number;
  tutor_chosen_by?: TutorChosenBy;
  public_job: boolean;
  invites?: IUser[];
  category?: ICategory;
  subject?: ISubject;
  service?: IService;
  student?: IUser;
  status?: JobStatus;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
}
