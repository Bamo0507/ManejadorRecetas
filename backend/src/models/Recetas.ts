export interface Receta {
    id: number;
    nombre: string;
    descripcion: string;
    complejidad: "BAJA" | "MEDIA" | "ALTA";
    momento_comida: "DESAYUNO" | "ALMUERZO" | "CENA" | "SNACK" | "POSTRE";
    nivel_picante: "NULO" | "SUAVE" | "MEDIO" | "FUERTE" | "EXTREMO";
    fecha_creacion: Date;
    tiempo_completacion: number; 
    creado_por: number; 
}


export interface Recetaget {
    id: number;
    nombre: string;
    descripcion: string;
    complejidad: "BAJA" | "MEDIA" | "ALTA";
    momento_comida: "DESAYUNO" | "ALMUERZO" | "CENA" | "SNACK" | "POSTRE";
    nivel_picante: "NULO" | "SUAVE" | "MEDIO" | "FUERTE" | "EXTREMO";
    fecha_creacion: Date;
    tiempo_completacion: number; 
    creado_por: number;
    creado_por_username: string; 
}


