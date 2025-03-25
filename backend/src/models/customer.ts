import { ObjectId } from 'mongodb';

export default interface Customer {
  _id?: ObjectId;
  name: string;
  email: string;
  phone: string;
  subscriptionType: string;
  rentalHistory?: ObjectId[];  // References to rented movies
}
