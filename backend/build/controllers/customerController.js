"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCustomer = exports.updateCustomer = exports.createCustomer = exports.getCustomers = void 0;
const mongodb_1 = require("mongodb");
const database_1 = require("../database");
// Get all customers
const getCustomers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const db = (0, database_1.getDb)();
    const customers = yield db.collection('customers').find().toArray();
    res.json(customers);
});
exports.getCustomers = getCustomers;
// Create a new customer
const createCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const db = (0, database_1.getDb)();
    const newCustomer = req.body;
    const result = yield db.collection('customers').insertOne(newCustomer);
    res.json(result);
});
exports.createCustomer = createCustomer;
// Update customer by ID
const updateCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const db = (0, database_1.getDb)();
    const { id } = req.params;
    const updatedCustomer = req.body;
    const result = yield db.collection('customers').updateOne({ _id: new mongodb_1.ObjectId(id) }, { $set: updatedCustomer });
    res.json(result);
});
exports.updateCustomer = updateCustomer;
// Delete customer by ID
const deleteCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const db = (0, database_1.getDb)();
    const { id } = req.params;
    const result = yield db.collection('customers').deleteOne({ _id: new mongodb_1.ObjectId(id) });
    res.json(result);
});
exports.deleteCustomer = deleteCustomer;
