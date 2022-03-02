export interface IToken {
  _id?: string;
  token?: string;
  source?: string;
  user?: object;
  created_at?: Date;
  expired_at?: Date;
  deleted_at?: Date;
}
