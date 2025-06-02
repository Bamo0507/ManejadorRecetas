import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { unidadesTable } from '../db/schema';

const db = drizzle(process.env.DATABASE_URL!);

export interface Unidad {
  id: number;
  nombre: string;
}

export async function getUnidades(): Promise<Unidad[]> {
  const rows = await db.select().from(unidadesTable);
  return rows.map((u) => ({
    id: u.id,
    nombre: u.nombre,
  }));
}