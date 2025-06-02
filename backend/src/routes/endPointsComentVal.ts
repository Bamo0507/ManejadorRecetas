import { Router, Request, Response } from 'express';
import {
  getComentariosReceta,
  postComentario,
  deleteComentario,
  getValoracionesReceta,
  postValoracion,
  deleteValoracion,
} from '../orm/ormRecetas';

const router = Router();

router.get('/recetas/:id/comentarios', (req: Request, res: Response) => {
  const recetaId = parseInt(req.params.id);
  getComentariosReceta(recetaId)
    .then((comentarios) => res.json(comentarios))
    .catch((err) => res.status(500).json({ message: 'Error al obtener comentarios', err }));
});


router.post('/recetas/:id/comentarios', (req: Request, res: Response) => {
  const recetaId = parseInt(req.params.id);
  const { id_usuario, comentario } = req.body;
  postComentario(recetaId, id_usuario, comentario)
    .then((dbResp) => res.status(201).json({ id: dbResp.id }))
    .catch((err) => res.status(500).json({ message: 'Error al crear comentario', err }));
});

router.delete('/comentarios/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  deleteComentario(id)
    .then(() => res.status(204).end())
    .catch((err) => res.status(500).json({ message: 'Error al eliminar comentario', err }));
});

router.get('/recetas/:id/valoraciones', (req: Request, res: Response) => {
  const recetaId = parseInt(req.params.id);
  getValoracionesReceta(recetaId)
    .then((val) => res.json(val))
    .catch((err) => res.status(500).json({ message: 'Error al obtener valoraciones', err }));
});

router.post('/recetas/:id/valoraciones', (req: Request, res: Response) => {
  const recetaId = parseInt(req.params.id);
  const { id_usuario, valoracion } = req.body;
  postValoracion(recetaId, id_usuario, valoracion)
    .then((dbResp) => res.status(201).json({ id: dbResp.id }))
    .catch((err) => {
    
      if (err.code === 'P0001') {
        return res.status(400).json({ message: err.message });
      }
      res.status(500).json({ message: 'Error al crear valoración', err });
    });
});

router.delete('/valoraciones/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  deleteValoracion(id)
    .then(() => res.status(204).end())
    .catch((err) => res.status(500).json({ message: 'Error al eliminar valoración', err }));
});

export default router;