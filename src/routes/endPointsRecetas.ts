import { Router, Request, Response } from "express";
import { Receta } from "../models/Recetas"; 

const router = Router();

const recetas: Receta[] = [];

const recetasEjemplo: Receta[] = [
    {
        id: 1,
        nombre: "Tacos de pollo",
        descripcion: "Tacos con pollo sazonado y vegetales frescos.",
        complejidad: "BAJA",
        momento_comida: "ALMUERZO",
        nivel_picante: "SUAVE",
        fecha_creacion: new Date("2023-10-01"),
        tiempo_completacion: 30, 
        creado_por: 1
    },
    {
        id: 2,
        nombre: "Ensalada César",
        descripcion: "Ensalada fresca con aderezo César y crutones.",
        complejidad: "BAJA",
        momento_comida: "ALMUERZO",
        nivel_picante: "NULO",
        fecha_creacion: new Date("2023-10-02"),
        tiempo_completacion: 15, 
        creado_por: 2
    },
    {
        id: 3,
        nombre: "Sopa de lentejas",
        descripcion: "Sopa nutritiva de lentejas con verduras.",
        complejidad: "MEDIA",
        momento_comida: "CENA",
        nivel_picante: "SUAVE",
        fecha_creacion: new Date("2023-10-03"),
        tiempo_completacion: 45, 
        creado_por: 1
    }
];

recetas.push(...recetasEjemplo); // Remove this line when orm is implemented

// Obtener todas las recetas
router.get("/recetas", (req: Request, res: Response) => {
    res.json(recetas);    
});

// Crear una nueva receta
router.post("/recetas", (req: Request, res: Response) => {
  const newReceta: Receta = {
    id: recetas.length + 1,
    nombre: req.body.nombre,
    descripcion: req.body.descripcion,
    complejidad: req.body.complejidad,
    momento_comida: req.body.momento_comida,
    nivel_picante: req.body.nivel_picante,
    fecha_creacion: new Date(),
    tiempo_completacion: req.body.tiempo_completacion,
    creado_por: req.body.creado_por
  };
  recetas.push(newReceta);
  res.status(201).json(newReceta);
});

// Actualizar una receta por ID
router.patch("/recetas/:id", (req: Request, res: Response) => {
  const recetaId = parseInt(req.params.id);
  const recetaIndex = recetas.findIndex(r => r.id === recetaId);

  if (recetaIndex !== -1) {
    recetas[recetaIndex] = { ...recetas[recetaIndex], nombre: req.body.nombre, descripcion: req.body.descripcion};
    res.json(recetas[recetaIndex]);
  } else {
    res.status(404).json({ message: "Receta no encontrada" });
  }
});

// Eliminar una receta por ID
router.delete("/recetas/:id", (req: Request, res: Response) => {
  const recetaId = parseInt(req.params.id);
  const recetaIndex = recetas.findIndex(r => r.id === recetaId);

  if (recetaIndex !== -1) {
    recetas.splice(recetaIndex, 1);
    res.status(204).send();
  } else {
    res.status(404).json({ message: "Receta no encontrada" });
  }
});

export default router;