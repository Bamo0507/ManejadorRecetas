import { drizzle } from 'drizzle-orm/node-postgres';
import { recetaIngredientesTable, recetaAlergiasTable, recetaUtensiliosTable } from '../db/schema';
import { eq } from 'drizzle-orm';

const db = drizzle(process.env.DATABASE_URL!);

export async function addIngredientesAReceta(
  recetaId: number,
  lista: { id_ingrediente: number, id_unidades: number, cantidad: number }[]
) {
  const inserts = lista.map(item => ({
    id_receta: recetaId,
    id_ingrediente: item.id_ingrediente,
    id_unidades: item.id_unidades,
    cantidad: item.cantidad
  }));
  await db.insert(recetaIngredientesTable).values(inserts);
}

// insert de alergias
export async function addAlergiasAReceta(
  recetaId: number,
  lista: { id_alergia: number }[]
) {
  const inserts = lista.map(item => ({
    id_receta: recetaId,
    id_alergia: item.id_alergia
  }));
  await db.insert(recetaAlergiasTable).values(inserts);
}

// insert de utensilios
export async function addUtensiliosAReceta(
  recetaId: number,
  lista: { id_utensilio: number }[]
) {
  const inserts = lista.map(item => ({
    id_receta: recetaId,
    id_utensilio: item.id_utensilio
  }));
  await db.insert(recetaUtensiliosTable).values(inserts);
}