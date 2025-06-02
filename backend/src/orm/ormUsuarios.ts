import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { usersTable } from '../db/schema';
import { eq } from 'drizzle-orm';
import type { User } from '../models/Usuarios';

const db = drizzle(process.env.DATABASE_URL!);

export async function getAllUsers(): Promise<User[]> {
  const rows = await db.select().from(usersTable);
  return rows.map((u) => ({
    id: u.id,
    username: u.username,
  }));
}