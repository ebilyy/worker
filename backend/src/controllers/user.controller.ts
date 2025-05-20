import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';
import { AppError } from '../middleware/error-handler';

const prisma = new PrismaClient();

export const createUser = async (req: Request, res: Response) => {
  const { email, password, firstName, lastName, role } = req.body;
  console.log(req.body);
  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new AppError(400, 'Email already exists');
    }

    const hashedPassword = await hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role
      }
    });

    // Don't send password in response
    const { password: _, ...userWithoutPassword } = user;
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(500, 'Error creating user');
  }
};

export const getUsers = async (_req: Request, res: Response) => {
  console.log('getUsers');
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });
    res.json(users);
  } catch (error) {
    console.log(error);
    throw new AppError(500, 'Error fetching users');
  }
};

export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    res.json(user);
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(500, 'Error fetching user');
  }
}; 