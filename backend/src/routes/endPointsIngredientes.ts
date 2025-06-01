import { Router, Request, Response } from "express";
import { Ingrediente , IngredienteGet } from "../models/Ingredientes";
import { deleteIngrediente, getIngredientesView, postIngrediente, updateIngrediente } from "../orm/ormIngredientes";
import { ne } from "drizzle-orm";

const router = Router();

const ingredientes: Ingrediente[] = [];


// Obtener todas las recetas
router.get("/ingredientes", (req: Request, res: Response) => {
    getIngredientesView()
    .then((ingredientesFromDb) => {
        res.json(ingredientesFromDb);
    })
    .catch((error) => {
        res.status(500).json({ message: "Error al obtener recetas", error });
    });
});

// Crear una nueva receta
router.post("/ingredientes", (req: Request, res: Response) => {
  const newIngrediente: Ingrediente = {
    id: ingredientes.length + 1,
    nombre: req.body.nombre,
  };
  postIngrediente(newIngrediente)
  .then((dbResponse)=>{
    newIngrediente.id = dbResponse.id; // Assign the ID returned from the database
    res.status(201).json(newIngrediente);
  })
  .catch((error)=>{
      res.status(500).json({ message: "Error al agregar receta", error})
  })
});

// Actualizar una receta por ID
router.patch("/ingredientes/:id", (req: Request, res: Response) => {
  const ingredienteId = parseInt(req.params.id);
  const ingredienteNombre = req.body.nombre;
  updateIngrediente(ingredienteId, ingredienteNombre)
  .then((dbResponse) => {
    res.status(200).json({ message: "Ingrediente actualizado correctamente" });
  })
  .catch((error) => {
    res.status(404).json({ message: "Receta no encontrada" });
  });
});

// Eliminar una receta por ID
router.delete("/ingredientes/:id", (req: Request, res: Response) => {
  const ingredienteId = parseInt(req.params.id);
  deleteIngrediente(ingredienteId)
  .then((dbResponse) => {
    res.status(204).json({ message: "Receta eliminada correctamente" });
  })
  .catch((error) => {
    res.status(404).json({ message: "Receta no encontrada" });
  });
});


export default router;