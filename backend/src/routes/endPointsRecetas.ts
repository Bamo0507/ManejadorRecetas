import { Router, Request, Response } from "express";
import { Receta , Recetaget } from "../models/Recetas"; 
import { deleteReceta, getRecetasView, postReceta, updateReceta, getIngredientesReceta, getAlergiasReceta, getUtensiliosReceta } from "../orm/ormRecetas";

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

// Obtener todas las recetas
router.get('/recetas', (req: Request, res: Response) => {
  const userId = parseInt(req.query.userId as string) || 0;
  getRecetasView(userId)
    .then((recetas) => res.json(recetas))
    .catch((error) =>
      res.status(500).json({ message: 'Error al obtener recetas', error })
    );
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
  postReceta(newReceta)
  .then((dbResponse)=>{
    newReceta.id = dbResponse.id;
    res.status(201).json(newReceta);
  })
  .catch((error)=>{
      res.status(500).json({ message: "Error al agregar receta", error})
  })
});

// Actualizar una receta por ID
router.patch('/recetas/:id', (req: Request, res: Response) => {
  const recetaId = parseInt(req.params.id);
  const recetaNombre = req.body.nombre;
  const recetaDescripcion = req.body.descripcion;
  updateReceta(recetaId, recetaNombre, recetaDescripcion)
    .then(() => res.json({ message: 'Receta actualizada correctamente' }))
    .catch((err) => res.status(404).json({ message: 'Receta no encontrada', err }));
});

// Eliminar una receta por ID
router.delete("/recetas/:id", (req: Request, res: Response) => {
  const recetaId = parseInt(req.params.id);
  deleteReceta(recetaId)
  .then((dbResponse) => {
    res.status(204).json({ message: "Receta eliminada correctamente" });
  })
  .catch((error) => {
    res.status(404).json({ message: "Receta no encontrada" });
  });
});

router.get('/recetas/:id/ingredientes', (req: Request, res: Response) => {
  const recetaId = parseInt(req.params.id);
  getIngredientesReceta(recetaId)
    .then((ing) => res.json(ing))
    .catch((err) => res.status(500).json({ message: 'Error al obtener ingredientes', err }));
});

router.get('/recetas/:id/alergias', (req: Request, res: Response) => {
  const recetaId = parseInt(req.params.id);
  getAlergiasReceta(recetaId)
    .then((alg) => res.json(alg))
    .catch((err) => res.status(500).json({ message: 'Error al obtener alergias', err }));
});

router.get('/recetas/:id/utensilios', (req: Request, res: Response) => {
  const recetaId = parseInt(req.params.id);
  getUtensiliosReceta(recetaId)
    .then((ut) => res.json(ut))
    .catch((err) => res.status(500).json({ message: 'Error al obtener utensilios', err }));
});

export default router;