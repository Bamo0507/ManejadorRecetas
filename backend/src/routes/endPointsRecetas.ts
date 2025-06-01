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

//recetas.push(...recetasEjemplo); // Remove this line when orm is implemented

// Obtener todas las recetas
router.get("/recetas", (req: Request, res: Response) => {
    getRecetasView()
    .then((recetasFromDb) => {
        res.json(recetasFromDb);
    })
    .catch((error) => {
        res.status(500).json({ message: "Error al obtener recetas", error });
    });
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
    newReceta.id = dbResponse.id; // Assign the ID returned from the database
    res.status(201).json(newReceta);
  })
  .catch((error)=>{
      res.status(500).json({ message: "Error al agregar receta", error})
  })
});

// Actualizar una receta por ID
router.patch("/recetas/:id", (req: Request, res: Response) => {
  const recetaId = parseInt(req.params.id);
  const recetaNombre = req.body.nombre;
  const recetaDescripcion = req.body.descripcion;
  updateReceta(recetaId, recetaNombre, recetaDescripcion)
  .then((dbResponse) => {
    res.status(200).json({ message: "Receta actualizada correctamente" });
  })
  .catch((error) => {
    res.status(404).json({ message: "Receta no encontrada" });
  });
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

router.get("/recetas/:id/ingredientes", (req: Request, res: Response) => {
  const recetaId = parseInt(req.params.id);
  getIngredientesReceta(recetaId)
    .then((ingredientes) => {
      res.json(ingredientes);
    })
    .catch((error) => {
      res.status(500).json({ message: "Error al obtener ingredientes", error });
    });
});

router.get("/recetas/:id/alergias", (req: Request, res: Response) => {
  const recetaId = parseInt(req.params.id);
  getAlergiasReceta(recetaId)
    .then((alergias) => {
      res.json(alergias);
    })
    .catch((error) => {
      res.status(500).json({ message: "Error al obtener alergias", error });
    }
    );
});

router.get("/recetas/:id/utensilios", (req: Request, res: Response) => {
  const recetaId = parseInt(req.params.id);
  getUtensiliosReceta(recetaId)
    .then((utensilios) => {
      res.json(utensilios);
    })
    .catch((error) => {
      res.status(500).json({ message: "Error al obtener utensilios", error });
    }
    );
});

export default router;