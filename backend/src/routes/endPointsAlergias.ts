import { Router, Request, Response } from 'express';
import { Alergia } from '../models/Alergias';
import { getAllAlergias } from '../orm/ormAlergias';

const router = Router();

router.get('/alergias', (req: Request, res: Response) => {
  getAllAlergias()
    .then((all) => res.json(all))
    .catch((err) => res.status(500).json({ message: 'Error al obtener alergias', err }));
});

export default router;