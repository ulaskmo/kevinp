import { MongoClient, Db } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

let db: Db;

export const connectToDb = async (callback: Function) => {
    const client = new MongoClient(process.env.DB_CONN_STRING as string);
    try {
        await client.connect();
        db = client.db(process.env.DB_NAME);
        callback();
    } catch (error) {
        console.error(error);
    }
};

export const getDb = () => db;
