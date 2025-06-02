import { drizzle } from 'drizzle-orm/node-postgres';
import { alergiasTable } from '../db/schema';

const db = drizzle(process.env.DATABASE_URL!);

export async function getAllAlergias(): Promise<{ id: number, nombre: string }[]> {
  return await db.select().from(alergiasTable);
}