try {
    const { config } = await
    import ('dotenv');
    config();
} catch {
    // Vercel provides environment variables directly.
}

import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql);