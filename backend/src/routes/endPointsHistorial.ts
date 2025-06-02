import { Router, Request, Response } from 'express';
import {
  getHistorialReceta,
  getHistorialIngrediente,
} from '../orm/ormRecetas';

const router = Router();

router.get('/recetas/:id/historial', (req: Request, res: Response) => {
  const recetaId = parseInt(req.params.id);
  getHistorialReceta(recetaId)
    .then((hist) => res.json(hist))
    .catch((err) => res.status(500).json({ message: 'Error al obtener historial de receta', err }));
});

router.get('/ingredientes/:id/historial', (req: Request, res: Response) => {
  const ingredienteId = parseInt(req.params.id);
  getHistorialIngrediente(ingredienteId)
    .then((hist) => res.json(hist))
    .catch((err) => res.status(500).json({ message: 'Error al obtener historial de ingrediente', err }));
});

export default router;