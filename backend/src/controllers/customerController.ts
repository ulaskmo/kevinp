import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import Customer from '../models/customer';
import { getDb } from '../database';

// Get all customers
export const getCustomers = async (req: Request, res: Response) => {
    const db = getDb();
    const customers = await db.collection('customers').find().toArray();
    res.json(customers);
};

// Create a new customer
export const createCustomer = async (req: Request, res: Response) => {
    const db = getDb();
    const newCustomer: Customer = req.body;
    const result = await db.collection('customers').insertOne(newCustomer);
    res.json(result);
};

// Update customer by ID
export const updateCustomer = async (req: Request, res: Response) => {
    const db = getDb();
    const { id } = req.params;
    const updatedCustomer: Partial<Customer> = req.body;
    const result = await db.collection('customers').updateOne({ _id: new ObjectId(id) }, { $set: updatedCustomer });
    res.json(result);
};

// Delete customer by ID
export const deleteCustomer = async (req: Request, res: Response) => {
    const db = getDb();
    const { id } = req.params;
    const result = await db.collection('customers').deleteOne({ _id: new ObjectId(id) });
    res.json(result);
};
