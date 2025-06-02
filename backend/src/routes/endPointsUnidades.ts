import { Router, Request, Response } from 'express';
import { getUnidades, Unidad } from '../orm/ormUnidades';

const router = Router();

router.get('/unidades', async (req: Request, res: Response) => {
  try {
    const lista: Unidad[] = await getUnidades();
    res.json(lista);
  } catch (err) {
    console.error('Error al obtener unidades:', err);
    res.status(500).json({ message: 'Error al obtener unidades', err });
  }
});

export default router;