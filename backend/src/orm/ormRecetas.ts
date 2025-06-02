import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';

import { alias } from "drizzle-orm/pg-core";

import {
    recetasTable,
    recetasView,
    ingredientesRecetaView,
    alergiasRecetaView,
    utensiliosRecetaView,
    comentariosTable,
    valoracionesTable,
    recetasFavoritasTable,
    historialRecetasTable,
    historialIngredientesTable
} from '../db/schema';

import { sql, eq, desc } from "drizzle-orm";

import { Receta, Recetaget } from '../models/Recetas';
import { Comentario } from '../models/Comentario';
import { Valoracion } from '../models/Valoracion';
import { Ingrediente } from '../models/Ingredientes';
import { Alergia } from '../models/Alergias';

const db = drizzle(
    process.env.DATABASE_URL!
);

export async function getRecetasView(userId: number): Promise<
  (Recetaget & { isFavorito: boolean })[]
> {
    const rf = alias(recetasFavoritasTable, 'rf');
    const rows = await db
        .select({
        id: recetasView.id,
        nombre: recetasView.nombre,
        descripcion: recetasView.descripcion,
        complejidad: recetasView.complejidad,
        momento_comida: recetasView.momento_comida,
        nivel_picante: recetasView.nivel_picante,
        fecha_creacion: recetasView.fecha_creacion,
        tiempo_completacion: recetasView.tiempo_completacion,
        creado_por: recetasView.creado_por,
        creado_por_username: recetasView.creado_por_username,
        isFavorito: sql`CASE WHEN rf.id_usuario IS NULL THEN FALSE ELSE TRUE END`.as('isFavorito'),
        })
        .from(recetasView)
        .leftJoin(
            rf,
            sql`${recetasView.id} = ${rf.id_receta} AND ${rf.id_usuario} = ${userId}`
        );

    return rows.map((r) => ({
        id: r.id,
        nombre: r.nombre,
        descripcion: r.descripcion,
        complejidad: r.complejidad,
        momento_comida: r.momento_comida,
        nivel_picante: r.nivel_picante,
        fecha_creacion: r.fecha_creacion,
        tiempo_completacion: r.tiempo_completacion,
        creado_por: r.creado_por,
        creado_por_username: r.creado_por_username ?? '',
        isFavorito: r.isFavorito as boolean,
    }));
}

export async function postReceta(receta: Receta): Promise<{ status: string; id: number }> {
    const inserted = await db
      .insert(recetasTable)
      .values({
        nombre: receta.nombre,
        descripcion: receta.descripcion,
        complejidad: receta.complejidad,
        momento_comida: receta.momento_comida,
        nivel_picante: receta.nivel_picante,
        fecha_creacion: receta.fecha_creacion,
        tiempo_completacion: receta.tiempo_completacion,
        creado_por: receta.creado_por,
      })
      .returning({ id: recetasTable.id });
    return { status: 'success', id: inserted[0].id };
}

export async function updateReceta(
    id: number,
    newNombre: string,
    newDescripcion: string
  ): Promise<{ status: string }> {
    await db
      .update(recetasTable)
      .set({ nombre: newNombre, descripcion: newDescripcion })
      .where(eq(recetasTable.id, id));
    return { status: 'success' };
}

export async function deleteReceta(id: number): Promise<{ status: string }> {
    await db.delete(recetasTable).where(eq(recetasTable.id, id));
    return { status: 'success' };
}

export async function getIngredientesReceta(recetaId: number): Promise<Ingrediente[]> {
    const ingredientes = await db
      .select()
      .from(ingredientesRecetaView)
      .where(eq(ingredientesRecetaView.id_receta, recetaId));
    return ingredientes.map((i) => ({
      id: i.id_ingrediente,
      nombre: i.nombre_ingrediente ?? 'Desconocido',
      cantidad: i.cantidad,
    }));
}
  
export async function getAlergiasReceta(recetaId: number): Promise<Alergia[]> {
    const alergias = await db
      .select()
      .from(alergiasRecetaView)
      .where(eq(alergiasRecetaView.id_receta, recetaId));
    return alergias.map((a) => ({
      id: a.id_alergia,
      nombre: a.nombre_alergia ?? 'Desconocido',
    }));
}
  
export async function getUtensiliosReceta(
    recetaId: number
  ): Promise<{ id: number; nombre: string; descripcion: string }[]> {
    const utensilios = await db
      .select()
      .from(utensiliosRecetaView)
      .where(eq(utensiliosRecetaView.id_receta, recetaId));
    return utensilios.map((u) => ({
      id: u.id_utensilio,
      nombre: u.nombre_utensilio ?? 'Desconocido',
      descripcion: u.descripcion_utensilio ?? 'Sin descripción',
    }));
}

export async function getComentariosReceta(recetaId: number): Promise<Comentario[]> {
    const comentarios = await db
      .select()
      .from(comentariosTable)
      .where(eq(comentariosTable.id_receta, recetaId))
      .orderBy(comentariosTable.id);
    return comentarios.map((c) => ({
      id: c.id,
      id_receta: c.id_receta,
      id_usuario: c.id_usuario,
      comentario: c.comentario,
    }));
  }
  
export async function postComentario(
    recetaId: number,
    usuarioId: number,
    texto: string
): Promise<{ status: string; id: number }> {
    const inserted = await db
      .insert(comentariosTable)
      .values({
        id_receta: recetaId,
        id_usuario: usuarioId,
        comentario: texto,
      })
      .returning({ id: comentariosTable.id });
    return { status: 'success', id: inserted[0].id };
}
  
export async function deleteComentario(id: number): Promise<{ status: string }> {
    await db.delete(comentariosTable).where(eq(comentariosTable.id, id));
    return { status: 'success' };
}

export async function getValoracionesReceta(recetaId: number): Promise<Valoracion[]> {
    const valoraciones = await db
      .select()
      .from(valoracionesTable)
      .where(eq(valoracionesTable.id_receta, recetaId))
      .orderBy(valoracionesTable.id);
    return valoraciones.map((v) => ({
      id: v.id,
      id_receta: v.id_receta,
      id_usuario: v.id_usuario,
      valoracion: v.valoracion,
    }));
  }
  
export async function postValoracion(
    recetaId: number,
    usuarioId: number,
    score: number
): Promise<{ status: string; id: number }> {
    const inserted = await db
      .insert(valoracionesTable)
      .values({
        id_receta: recetaId,
        id_usuario: usuarioId,
        valoracion: score,
      })
      .returning({ id: valoracionesTable.id });
    return { status: 'success', id: inserted[0].id };
}
  
export async function deleteValoracion(id: number): Promise<{ status: string }> {
    await db.delete(valoracionesTable).where(eq(valoracionesTable.id, id));
    return { status: 'success' };
}

export async function toggleFavoritoOrm(
    recetaId: number,
    usuarioId: number
): Promise<{ action: 'AGREGADO' | 'ELIMINADO' }> {
    const result = await db.execute(
        sql`SELECT toggle_favorito(${recetaId}, ${usuarioId}) AS action`
    );

    const action = (result.rows[0].action as string) === 'AGREGADO' ? 'AGREGADO' : 'ELIMINADO';
    return { action };
}
  
export async function getFavoritasUsuario(usuarioId: number): Promise<{ id_receta: number }[]> {
    const rows = await db
      .select({
        id_receta: recetasFavoritasTable.id_receta,
      })
      .from(recetasFavoritasTable)
      .where(eq(recetasFavoritasTable.id_usuario, usuarioId));
    return rows.map((r) => ({ id_receta: r.id_receta }));
}

export async function getHistorialReceta(recetaId: number): Promise<
  {
    id: number;
    id_receta: number;
    atributo_modificado: string;
    valor_anterior: string;
    valor_nuevo: string;
    realizado_en: Date;
  }[]
> {
  const rows = await db
    .select()
    .from(historialRecetasTable)
    .where(eq(historialRecetasTable.id_receta, recetaId))
    .orderBy(desc(historialRecetasTable.realizado_en));
  return rows.map((h) => ({
    id: h.id,
    id_receta: h.id_receta,
    atributo_modificado: h.atributo_modificado,
    valor_anterior: h.valor_anterior,
    valor_nuevo: h.valor_nuevo,
    realizado_en: h.realizado_en,
  }));
}

export async function getHistorialIngrediente(ingredienteId: number): Promise<
  {
    id: number;
    id_ingrediente: number;
    nombre_anterior: string;
    nombre_nuevo: string;
    realizado_en: Date;
  }[]
> {
  const rows = await db
    .select()
    .from(historialIngredientesTable)
    .where(eq(historialIngredientesTable.id_ingrediente, ingredienteId))
    .orderBy(historialIngredientesTable.realizado_en);
  return rows.map((h) => ({
    id: h.id,
    id_ingrediente: h.id_ingrediente,
    nombre_anterior: h.nombre_anterior,
    nombre_nuevo: h.nombre_nuevo,
    realizado_en: h.realizado_en,
  }));
}