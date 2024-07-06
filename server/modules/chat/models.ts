import { model } from 'mongoose';
import { Chat, ChatSchema, User, UserSchema } from './schemas';

export const UserModel = model<User>('User', UserSchema, 'users');
export const ChatModel = model<Chat>('Chat', ChatSchema, 'chats');