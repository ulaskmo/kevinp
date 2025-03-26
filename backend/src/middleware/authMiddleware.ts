import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserRole } from '../models/user';

// JWT secret key from environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'kevinproject_secure_jwt_secret_key_2025';

// Extend Express Request interface to include user property
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        username: string;
        role: UserRole;
      };
    }
  }
}

// Middleware to verify JWT token
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN format

  if (!token) {
    return res.status(401).json({ message: 'Access token is required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      username: string;
      role: UserRole;
    };
    
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

// Middleware to check if user has admin role
export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  if (req.user.role !== UserRole.ADMIN) {
    return res.status(403).json({ message: 'Admin access required' });
  }

  next();
};

// Middleware to check if user is accessing their own resource or is an admin
export const requireOwnershipOrAdmin = (userIdParam: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const resourceUserId = req.params[userIdParam];
    
    // Allow if user is admin or if they're accessing their own resource
    if (req.user.role === UserRole.ADMIN || req.user.userId === resourceUserId) {
      next();
    } else {
      return res.status(403).json({ message: 'Unauthorized access to this resource' });
    }
  };
};
