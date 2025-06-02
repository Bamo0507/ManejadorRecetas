import { Router, Request, Response } from 'express';
import { getAllUtensilios } from '../orm/ormUtensilios';

const router = Router();

router.get('/utensilios', (req: Request, res: Response) => {
    getAllUtensilios()
        .then((all) => res.json(all))
        .catch((err) => res.status(500).json({ message: 'Error al obtener utensilios', err }));
});

export default router;