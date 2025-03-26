import { MongoClient, Db } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

let db: Db;
let client: MongoClient;

// Connect to database (callback style - for compatibility)
export const connectToDb = async (callback: Function) => {
    client = new MongoClient(process.env.DB_CONN_STRING as string);
    try {
        await client.connect();
        db = client.db(process.env.DB_NAME);
        callback();
    } catch (error) {
        console.error(error);
    }
};

// Connect to database (promise style - for serverless)
export const connectToDatabase = async (): Promise<Db> => {
    if (db) {
        return db;
    }
    
    client = new MongoClient(process.env.DB_CONN_STRING as string);
    try {
        await client.connect();
        db = client.db(process.env.DB_NAME);
        return db;
    } catch (error) {
        console.error('Error connecting to database:', error);
        throw error;
    }
};

// Get database instance
export const getDb = () => {
    if (!db) {
        throw new Error('Database not connected. Call connectToDatabase() first.');
    }
    return db;
};

// Close database connection
export const closeDatabase = async () => {
    if (client) {
        await client.close();
    }
};
