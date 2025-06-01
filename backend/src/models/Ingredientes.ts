export interface Ingrediente {
    id: number;
    nombre: string;
}

export interface IngredienteGet {
    id: number;
    nombre: string;
    recetas_count: number; 
}