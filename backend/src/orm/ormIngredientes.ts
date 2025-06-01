import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { ingredientesView , ingredientesTable } from '../db/schema';
import { sql, eq } from "drizzle-orm";
import { Ingrediente, IngredienteGet } from '../models/Ingredientes';


const db = drizzle(
    process.env.DATABASE_URL!
);

export async function getIngredientesView(): Promise<IngredienteGet[]> {
    const ingredientes = await db.select().from(ingredientesView);
    return ingredientes.map(ingrediente => ({
        id: ingrediente.id,
        nombre: ingrediente.nombre,
        recetas_count: ingrediente.recetas_count ?? 0 // Aseguramos que siempre tenga un valor numérico
    }));
}

export async function postIngrediente(ingrediente: Ingrediente): Promise<{ status: string, id: number}> {
    const inserted = await db.insert(ingredientesTable).values({
        nombre: ingrediente.nombre
    }).returning({ id: ingredientesTable.id });
    return { status: "success", id: inserted[0].id };
}

export async function updateIngrediente(id: number , newNombre: string): Promise<{ status: string }> {
  await db.update(ingredientesTable)
  .set({ nombre: newNombre})
  .where(eq(ingredientesTable.id, id));
  return { status: "success" };
}

export async function deleteIngrediente(id: number): Promise<{ status: string }> {
    await db.delete(ingredientesTable)
    .where(eq(ingredientesTable.id, id));
    return { status: "success" };
}

