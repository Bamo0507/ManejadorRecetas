import { Router, Request, Response } from 'express';
import {
  addIngredientesAReceta,
  addAlergiasAReceta,
  addUtensiliosAReceta
} from '../orm/ormRecetaRelaciones';

const router = Router();


router.post('/recetas/:id/ingredientes', async (req: Request, res: Response) => {
  const recetaId = parseInt(req.params.id);
  const lista: { id_ingrediente: number, id_unidades: number, cantidad: number }[] = req.body.ingredientes;
  try {
    await addIngredientesAReceta(recetaId, lista);
    res.status(201).json({ message: 'Ingredientes asignados' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error asignando ingredientes' });
  }
});


router.post('/recetas/:id/alergias', async (req: Request, res: Response) => {
  const recetaId = parseInt(req.params.id);
  const lista: { id_alergia: number }[] = req.body.alergias;
  try {
    await addAlergiasAReceta(recetaId, lista);
    res.status(201).json({ message: 'Alergias asignadas' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error asignando alergias' });
  }
});

router.post('/recetas/:id/utensilios', async (req: Request, res: Response) => {
  const recetaId = parseInt(req.params.id);
  const lista: { id_utensilio: number }[] = req.body.utensilios;
  try {
    await addUtensiliosAReceta(recetaId, lista);
    res.status(201).json({ message: 'Utensilios asignados' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error asignando utensilios' });
  }
});

export default router;