import { ObjectId } from 'mongodb';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin'
}

export default interface User {
  _id?: ObjectId;
  username: string;
  password: string; // This should be hashed before storing
  email: string;
  role: UserRole;
  firstName?: string;
  lastName?: string;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
}
