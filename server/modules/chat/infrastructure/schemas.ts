import { Schema, Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const settings = {
  timestamps: true,
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform: (_: any, ret: any) => {
      ret.id = ret._id;
    }
  }
};

export interface User extends Document {
  id: string
  name: string
  username: string
  phone: string
}

const UserSchema = new Schema<User>({
  id: { type: String, default: uuidv4() },
  name: { type: String, required: true },
  username: { type: String, required: true },
  phone: { type: String, required: true }
}, settings);

export interface Message extends Document {
  id: string
  userId: string
  message: string
}

const MessageSchema = new Schema<Message>({
  id: { type: String, default: uuidv4() },
  message: { type: String, required: true },
  userId: {
    type: String,
    ref: 'User', // Model ref
    localField: 'userId', // Reference model primary key
    foreignField: 'id', // foreignKey
  }
}, settings);

export interface Chat extends Document {
  id: string,
  name: string,
  messages: Array<Message>
}

const ChatSchema = new Schema<Chat>({
  id: { type: String, default: uuidv4() },
  name: { type: String, required: true },
  messages: [MessageSchema],
}, settings);


export { UserSchema, ChatSchema }