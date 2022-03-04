import { ICommonUser, ITutor, IStudent, IAgent, ICSUser } from './';

export interface IUser extends ICommonUser {
  agentProfile?: IAgent;
  csProfile?: ICSUser;
  tutorProfile?: ITutor;
  studentProfile?: IStudent;
  _id?: string;
}
