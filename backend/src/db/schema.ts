import { sql, eq } from "drizzle-orm";
import { timestamp, integer, pgTable, pgView, pgEnum, varchar, serial } from "drizzle-orm/pg-core";


export const complejidadEnum = pgEnum("Complejidad", [
  "BAJA",
  "MEDIA",
  "ALTA",
]);

export const momentoComidaEnum = pgEnum("MomentoComida", [
  "DESAYUNO",
  "ALMUERZO",
  "CENA",
  "POSTRE",
  "SNACK",
]);

export const nivelPicanteEnum = pgEnum("NivelPicante", [
  "NULO",
  "SUAVE",
  "MEDIO",
  "FUERTE",
  "EXTREMO",
]);

export const usersTable = pgTable("Usuarios", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 20 }).notNull().unique(),
  password: varchar("password", { length: 50 }).notNull(),
});

export const ingredientesTable = pgTable("Ingredientes", {
  id: serial("id").primaryKey(),
  nombre: varchar("nombre", { length: 50 }).notNull().unique(),
});

export const categoriasTable = pgTable("Categorias", {
  id: serial("id").primaryKey(),
  nombre: varchar("nombre", { length: 50 }).notNull().unique(),
});

export const recetasTable = pgTable("Recetas", {
  id: serial("id").primaryKey(),
  nombre: varchar("nombre", { length: 70 }).notNull(),
  descripcion: varchar("descripcion", { length: 100 }).notNull(),
  complejidad: complejidadEnum("complejidad").notNull().default("MEDIA"),
  momento_comida: momentoComidaEnum("momento_comida").notNull(),
  nivel_picante: nivelPicanteEnum("nivel_picante").notNull().default("NULO"),
  fecha_creacion: timestamp("fecha_creacion", { withTimezone: false }).notNull().defaultNow(), // timestamp
  tiempo_completacion: integer("tiempo_completacion").notNull(), // check > 0
  creado_por: integer("creado_por").notNull(), // ref to Usuarios.id
});

export const recetaCategoriasTable = pgTable("Receta_categorias", {
  id_receta: integer("id_receta").notNull(), // ref to Recetas.id
  id_categoria: integer("id_categoria").notNull(), // ref to Categorias.id
});// tiene que tener constraint de unique entre ambos IDs

export const unidadesTable = pgTable("Unidades", {
  id: serial("id").primaryKey(),
  nombre: varchar("nombre", { length: 10 }).notNull().unique(),
});

export const recetaIngredientesTable = pgTable("Receta_ingredientes", {
  id_receta: integer("id_receta").notNull(), // ref to Recetas.id
  id_ingrediente: integer("id_ingrediente").notNull(), // ref to Ingredientes.id
  id_unidades: integer("id_unidades").notNull(), // ref to Unidades.id
  cantidad: integer("cantidad").notNull(), // check > 0
});

export const recetasFavoritasTable = pgTable("Recetas_favoritas", {
  id_receta: integer("id_receta").notNull(), // ref to Recetas.id
  id_usuario: integer("id_usuario").notNull(), // ref to Usuarios.id
  // tiene que tener constraint de unique entre ambos IDs
});

export const comentariosTable = pgTable("Comentarios", {
  id: serial("id").primaryKey(),
  id_receta: integer("id_receta").notNull(), // ref to Recetas.id
  id_usuario: integer("id_usuario").notNull(), // ref to Usuarios.id
  comentario: varchar("comentario", { length: 100 }).notNull(),
});

export const valoracionesTable = pgTable("Valoraciones", {
  id: serial("id").primaryKey(),
  id_receta: integer("id_receta").notNull(), // ref to Recetas.id
  id_usuario: integer("id_usuario").notNull(), // ref to Usuarios.id
  valoracion: integer("valoracion").notNull(), // check entre 1 y 5
});

export const historialRecetasTable = pgTable("Historial_recetas", {
  id: serial("id").primaryKey(),
  id_receta: integer("id_receta").notNull(), // ref to Recetas.id
  atributo_modificado: varchar("atributo_modificado", { length: 20 }).notNull(),
  valor_anterior: varchar("valor_anterior", { length: 100 }).notNull(),
  valor_nuevo: varchar("valor_nuevo", { length: 100 }).notNull(),
  realizado_en: timestamp("realizado_en", { withTimezone: false }).notNull().defaultNow(),
});

// se podra cambiar nombre y descripcion
export const historialIngredientesTable = pgTable("Historial_ingredientes", {
  id: serial("id").primaryKey(),
  id_ingrediente: integer("id_ingrediente").notNull(), // ref to Ingredientes.id
  nombre_anterior: varchar("nombre_anterior", { length: 50 }).notNull(),
  nombre_nuevo: varchar("nombre_nuevo", { length: 50 }).notNull(),
  realizado_en: timestamp("realizado_en", { withTimezone: false }).notNull().defaultNow(),
});

// se podra cambiar nombre y descripcion
export const alergiasTable = pgTable("Alergias", {
  id: serial("id").primaryKey(),
  nombre: varchar("nombre", { length: 50 }).notNull().unique(),
});

export const recetaAlergiasTable = pgTable("Receta_alergias", {
  id_receta: integer("id_receta").notNull(),
  id_alergia: integer("id_alergia").notNull(), 
  // tiene que tener constraint de unique entre ambos IDs
})

export const utensiliosTable = pgTable("Utensilios",{
  id: serial("id").primaryKey(),
  nombre: varchar("nombre", { length: 50 }).notNull().unique(),
  descripcion: varchar("descripcion", { length: 100 }).notNull(),
})

export const recetaUtensiliosTable = pgTable("Receta_utensilios", {
  id_receta: integer("id_receta").notNull(), // ref to Recetas.id
  id_utensilio: integer("id_utensilio").notNull(), // ref to Utensilios.id
  // tiene que tener constraint de unique entre ambos IDs
});

// Views para recetas y sus relaciones
export const recetasView = pgView("Recetas_view").as((qb) => {
  return qb
    .select({
      id: recetasTable.id,
      nombre: recetasTable.nombre,
      descripcion: recetasTable.descripcion,
      complejidad: recetasTable.complejidad,
      momento_comida: recetasTable.momento_comida,
      nivel_picante: recetasTable.nivel_picante,
      fecha_creacion: recetasTable.fecha_creacion,
      tiempo_completacion: recetasTable.tiempo_completacion,
      creado_por: recetasTable.creado_por,
      creado_por_username: usersTable.username,
    })
    .from(recetasTable)
    .leftJoin(usersTable, eq(usersTable.id, recetasTable.creado_por))
});

export const ingredientesRecetaView = pgView("Ingredientes_receta_view").as((qb) => {
  return qb
    .select({
      id_receta: recetaIngredientesTable.id_receta,
      id_ingrediente: recetaIngredientesTable.id_ingrediente,
      cantidad: recetaIngredientesTable.cantidad,
      nombre_ingrediente: ingredientesTable.nombre,
    })
    .from(recetaIngredientesTable)
    .leftJoin(ingredientesTable, eq(ingredientesTable.id, recetaIngredientesTable.id_ingrediente))
});

export const alergiasRecetaView = pgView("Alergias_receta_view").as((qb) => {
  return qb
    .select({
      id_receta: recetaAlergiasTable.id_receta,
      id_alergia: recetaAlergiasTable.id_alergia,
      nombre_alergia: alergiasTable.nombre,
    })
    .from(recetaAlergiasTable)
    .leftJoin(alergiasTable, eq(alergiasTable.id, recetaAlergiasTable.id_alergia));
});

export const utensiliosRecetaView = pgView("Utensilios_receta_view").as((qb) => {
  return qb
    .select({
      id_receta: recetaUtensiliosTable.id_receta,
      id_utensilio: recetaUtensiliosTable.id_utensilio,
      nombre_utensilio: utensiliosTable.nombre,
      descripcion_utensilio: utensiliosTable.descripcion,
    })
    .from(recetaUtensiliosTable)
    .leftJoin(utensiliosTable, eq(utensiliosTable.id, recetaUtensiliosTable.id_utensilio));
});

// View para ingredientes y su relación con recetas
export const ingredientesView = pgView("Ingredientes_view").as((qb) => {
  return qb
    .select({
      id: ingredientesTable.id,
      nombre: ingredientesTable.nombre,
      recetas_count: sql<number>`COUNT("Receta_ingredientes"."id_receta")`.as("recetas_count"),
    })
    .from(ingredientesTable)
    .leftJoin(recetaIngredientesTable, eq(recetaIngredientesTable.id_ingrediente, ingredientesTable.id))
    .groupBy(ingredientesTable.id, ingredientesTable.nombre);
});