import { Router, Request, Response } from 'express';
import { toggleFavoritoOrm, getFavoritasUsuario } from '../orm/ormRecetas';

const router = Router();

router.post('/toggle_favorito', (req: Request, res: Response) => {
  const { id_receta, id_usuario } = req.body;
  toggleFavoritoOrm(id_receta, id_usuario)
    .then((dbResp) => {
      res.json({ favorito: dbResp.action === 'AGREGADO' });
    })
    .catch((err) => res.status(500).json({ message: 'Error toggle favorito', err }));
});

router.get('/usuarios/:id/favoritas', (req: Request, res: Response) => {
  const usuarioId = parseInt(req.params.id);
  getFavoritasUsuario(usuarioId)
    .then((rows) => res.json(rows))
    .catch((err) => res.status(500).json({ message: 'Error al obtener favoritas', err }));
});

export default router;