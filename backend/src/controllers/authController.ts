import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getDb } from '../database';
import User, { UserRole } from '../models/user';

// JWT configuration from environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'kevinproject_secure_jwt_secret_key_2025';
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '24h';
const SALT_ROUNDS = 10;

// Register a new user
export const register = async (req: Request, res: Response) => {
  try {
    const { username, password, email, firstName, lastName, role } = req.body;

    // Validate required fields
    if (!username || !password || !email) {
      return res.status(400).json({ message: 'Username, password, and email are required' });
    }

    const db = getDb();
    const usersCollection = db.collection('users');

    // Check if username already exists
    const existingUser = await usersCollection.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Check if email already exists
    const existingEmail = await usersCollection.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Create new user
    const newUser: User = {
      username,
      password: hashedPassword,
      email,
      role: role === UserRole.ADMIN ? UserRole.ADMIN : UserRole.USER, // Default to USER if not specified or invalid
      firstName,
      lastName,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Insert user into database
    const result = await usersCollection.insertOne(newUser);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json({
      message: 'User registered successfully',
      user: userWithoutPassword,
      userId: result.insertedId
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Login user
export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // Validate required fields
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const db = getDb();
    const usersCollection = db.collection('users');

    // Find user by username
    const user = await usersCollection.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Update last login time
    await usersCollection.updateOne(
      { _id: user._id },
      { $set: { lastLogin: new Date(), updatedAt: new Date() } }
    );

    // Generate JWT token with expiration from environment variable
    const token = jwt.sign(
      { 
        userId: user._id, 
        username: user.username,
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: '24h' } // Fixed expiration time
    );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    res.status(200).json({
      message: 'Login successful',
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get current user profile
export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const db = getDb();
    const usersCollection = db.collection('users');

    // Find user by ID
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = user;

    res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error('Error getting current user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Create initial admin user if no users exist
export const createInitialAdminUser = async () => {
  try {
    const db = getDb();
    const usersCollection = db.collection('users');

    // Check if any users exist
    const userCount = await usersCollection.countDocuments();
    if (userCount === 0) {
      // Create admin user
      const adminPassword = await bcrypt.hash('admin123', SALT_ROUNDS);
      const adminUser: User = {
        username: 'admin',
        password: adminPassword,
        email: 'admin@example.com',
        role: UserRole.ADMIN,
        firstName: 'Admin',
        lastName: 'User',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await usersCollection.insertOne(adminUser);
      console.log('Initial admin user created');

      // Create regular user
      const userPassword = await bcrypt.hash('user123', SALT_ROUNDS);
      const regularUser: User = {
        username: 'user',
        password: userPassword,
        email: 'user@example.com',
        role: UserRole.USER,
        firstName: 'Regular',
        lastName: 'User',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await usersCollection.insertOne(regularUser);
      console.log('Initial regular user created');
    }
  } catch (error) {
    console.error('Error creating initial admin user:', error);
  }
};
