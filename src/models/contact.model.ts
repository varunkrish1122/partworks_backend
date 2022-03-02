import { IContact } from '../interfaces';
import { Schema, model } from 'mongoose';

const schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'Users' },
  contact: { type: Schema.Types.ObjectId, ref: 'Users' },
  created_at: { type: Date, default: Date.now() },
  updated_at: { type: Date, default: Date.now() },
  deleted_at: { type: Date }
});

export const ContactModel = model<IContact>('Contacts', schema);
