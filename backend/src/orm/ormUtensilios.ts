import { drizzle } from 'drizzle-orm/node-postgres';
import { utensiliosTable } from '../db/schema';

const db = drizzle(process.env.DATABASE_URL!);

export async function getAllUtensilios(): Promise<{ id: number, nombre: string, descripcion: string }[]> {
  return await db.select().from(utensiliosTable);
}