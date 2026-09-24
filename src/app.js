try {
    const { config } = await
    import ('dotenv');
    config();
} catch {
    // Vercel supplies environment variables directly, so this is optional.
}

import express from 'express';
import { eq } from 'drizzle-orm';
import { db } from './db.js';
import { users } from './schema.js';

const app = express();
app.use(express.json());

async function verifyLogin(email, password, res) {
    if (typeof email !== 'string' || typeof password !== 'string') {
        return res.status(400).json({
            userExists: false,
            passwordCorrect: false,
            message: 'Email and password are required'
        });
    }

    try {
        const [user] = await db
            .select({ password: users.password })
            .from(users)
            .where(eq(users.email, email))
            .limit(1);

        const userExists = Boolean(user);
        const passwordCorrect = userExists && user.password === password;

        return res.json({
            userExists,
            passwordCorrect,
            message: !userExists ?
                'User does not exist' : passwordCorrect ?
                'Password is correct' : 'Password is incorrect'
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            userExists: false,
            passwordCorrect: false,
            message: 'Unable to check login'
        });
    }
}

async function changePassword(email, currentPassword, newPassword, res) {
    if (typeof email !== 'string' || typeof currentPassword !== 'string' || typeof newPassword !== 'string') {
        return res.status(400).json({
            passwordChanged: false,
            message: 'Email, current password, and new password are required'
        });
    }

    if (newPassword.length === 0 || newPassword.length > 50) {
        return res.status(400).json({
            passwordChanged: false,
            message: 'New password must be between 1 and 50 characters'
        });
    }

    try {
        const [user] = await db
            .select({ password: users.password })
            .from(users)
            .where(eq(users.email, email))
            .limit(1);

        if (!user) {
            return res.status(404).json({
                passwordChanged: false,
                message: 'User does not exist'
            });
        }

        if (user.password !== currentPassword) {
            return res.status(401).json({
                passwordChanged: false,
                message: 'Current password is incorrect'
            });
        }

        await db
            .update(users)
            .set({ password: newPassword })
            .where(eq(users.email, email));

        return res.json({
            passwordChanged: true,
            message: 'Password changed successfully'
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            passwordChanged: false,
            message: 'Unable to change password'
        });
    }
}

app.post('/api/login', async(req, res) => {
    const { email, password } = req.body || {};
    return verifyLogin(email, password, res);
});

app.post('/api/change-password', async(req, res) => {
    const { email, currentPassword, newPassword } = req.body || {};
    return changePassword(email, currentPassword, newPassword, res);
});

export default app;