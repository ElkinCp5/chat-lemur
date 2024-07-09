import { Schema, Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const settings = {
  timestamps: true,
  toJSON: {
    virtuals: true,
    versionKey: false,
  }
};

export interface User extends Document {
  uuid: string
  name: string
  username: string
  phone: string
}

const UserSchema = new Schema<User>({
  uuid: { type: String, default: uuidv4() },
  name: { type: String, required: true },
  username: { type: String, required: true },
  phone: { type: String, required: true }
}, settings);

export interface Message extends Document {
  uuid: string
  userId: string
  message: string
}

const MessageSchema = new Schema<Message>({
  uuid: { type: String, default: uuidv4() },
  message: { type: String, required: true },
  userId: {
    type: String,
    required: true
  }
}, settings);

MessageSchema.virtual('user', {
  ref: 'User', // The model to use
  localField: 'userId', // Find people where `localField`
  foreignField: 'uuid', // is equal to `foreignField`
  // count: true // And only get the number of docs
});

export interface Chat extends Document {
  uuid: string,
  name: string,
  messages: Array<Message>
}

const ChatSchema = new Schema<Chat>({
  uuid: { type: String, default: uuidv4() },
  name: { type: String, required: true },
  messages: [MessageSchema],
}, settings);


export { UserSchema, ChatSchema }