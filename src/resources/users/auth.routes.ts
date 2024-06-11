import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../../db/connect';
import dotenv from 'dotenv';
dotenv.config();


const router = express.Router();

router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    try {
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: {
                email: email
            }
        });

        // Create user in database
        if (existingUser) {
            return res.status(400).json({ error: "User with this email already exists" });
        }

        const user = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
            },
        });

        res.status(201).json({ id: user.id, message: "User created!" });
    } catch (error) {
        res.status(400).json({ error: 'Username already exists' });
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Find user in database
    const user = await prisma.user.findUnique({ where: { username } });

    if (!user) {
        return res.status(400).json({ error: 'User not found' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return res.status(400).json({ error: 'Invalid credentials' });
    }

    if (!process.env.JWT_SECRET) {
        throw new Error('Missing JWT_SECRET in environment');
      }
      if (!process.env.JWT_EXPIRES_IN) {
        throw new Error('Missing JWT_SECRET in environment');
      }

    // Create JWT token
    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    });

    res.json({ token });
});

export default router;
