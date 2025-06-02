import { Router, Request, Response } from 'express';
import { getAllUsers } from '../orm/ormUsuarios';

const router = Router();

router.get('/usuarios', (req: Request, res: Response) => {
  getAllUsers()
    .then((users) => res.json(users))
    .catch((err) => {
      console.error('Error al obtener usuarios:', err);
      res.status(500).json({ message: 'Error al obtener usuarios', err });
    });
});

export default router;