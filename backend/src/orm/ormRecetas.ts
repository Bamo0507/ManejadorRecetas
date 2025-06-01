import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { recetasTable, recetasView, utensiliosRecetaView, ingredientesRecetaView, alergiasRecetaView } from '../db/schema';
import { Receta, Recetaget } from "../models/Recetas"; 
import { pgTable, pgView, pgEnum, serial, timestamp, integer, varchar } from "drizzle-orm/pg-core";
import { sql, eq } from "drizzle-orm";
import { Ingrediente } from '../models/Ingredientes';
import { Alergia } from '../models/Alergias';


const db = drizzle(
    process.env.DATABASE_URL!
);

//const Recetas = Array<Receta>();

export async function getRecetasView(): Promise<Recetaget[]> {
    const recetas = await db.select().from(recetasView);
    return recetas.map(receta => ({
        id: receta.id,
        nombre: receta.nombre,
        descripcion: receta.descripcion,
        complejidad: receta.complejidad,
        momento_comida: receta.momento_comida,
        nivel_picante: receta.nivel_picante,
        fecha_creacion: receta.fecha_creacion,
        tiempo_completacion: receta.tiempo_completacion,
        creado_por: receta.creado_por,
        creado_por_username: receta.creado_por_username ?? ""
    }));
}

export async function postReceta(receta: Receta): Promise<{ status: string, id: number}> {
    const inserted = await db.insert(recetasTable).values({
        nombre: receta.nombre,
        descripcion: receta.descripcion,
        complejidad: receta.complejidad,
        momento_comida: receta.momento_comida,
        nivel_picante: receta.nivel_picante,
        fecha_creacion: receta.fecha_creacion,
        tiempo_completacion: receta.tiempo_completacion,
        creado_por: receta.creado_por
    }).returning({ id: recetasTable.id });
    return { status: "success", id: inserted[0].id };
}

export async function updateReceta(id: number , newNombre: string, newDescripcion: string): Promise<{ status: string }> {
  await db.update(recetasTable)
  .set({ nombre: newNombre, descripcion: newDescripcion })
  .where(eq(recetasTable.id, id));
  return { status: "success" };
}

export async function deleteReceta(id: number): Promise<{ status: string }> {
    await db.delete(recetasTable)
    .where(eq(recetasTable.id, id));
    return { status: "success" };
}

export async function getIngredientesReceta(recetaId: number): Promise<Ingrediente[]> {
    const ingredientes = await db.select().from(ingredientesRecetaView).where(eq(ingredientesRecetaView.id_receta, recetaId));
    return ingredientes.map(ingrediente => ({
        id: ingrediente.id_ingrediente,
        nombre: ingrediente.nombre_ingrediente ?? "Desconocido",
        cantidad: ingrediente.cantidad
    }));
}

export async function getAlergiasReceta(recetaId: number): Promise<Alergia[]> {
    const alergias = await db.select().from(alergiasRecetaView).where(eq(alergiasRecetaView.id_receta, recetaId));
    return alergias.map(alergia => ({
        id: alergia.id_alergia,
        nombre: alergia.nombre_alergia ?? "Desconocido"
    }));
}

export async function getUtensiliosReceta(recetaId: number): Promise<{ id_utensilio: number, nombre_utensilio: string, descripcion_utensilio: string }[]> {
    const utensilios = await db.select().from(utensiliosRecetaView).where(eq(utensiliosRecetaView.id_receta, recetaId));
    return utensilios.map(utensilio => ({
        id_utensilio: utensilio.id_utensilio,
        nombre_utensilio: utensilio.nombre_utensilio ?? "Desconocido",
        descripcion_utensilio: utensilio.descripcion_utensilio ?? "Sin descripción"
    }));
}