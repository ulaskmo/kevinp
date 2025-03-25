import { ObjectId } from 'mongodb';

export default interface Movie {
  _id?: ObjectId;
  title: string;
  director: string;
  genre: string;
  year: number;
  rentalPrice: number;
  availableCopies: number;
}
