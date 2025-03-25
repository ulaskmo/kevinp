import { ObjectId } from 'mongodb';

export default interface Rental {
  _id?: ObjectId;
  movieId: ObjectId;
  customerId: ObjectId;
  rentalDate: Date;
  returnDate?: Date;
}
