import express, { Request, Response } from 'express';
import cors from 'cors';

import dinoRoutes from './routes/apiExample';
import recetaRoutes from './routes/endPointsRecetas';
import ingredienteRoutes from './routes/endPointsIngredientes';
import comentValRoutes from './routes/endPointsComentVal';
import favoritoRoutes from './routes/endPointsFavoritos';
import usuariosRoutes from './routes/endPointsUsuarios';
import historialRoutes from './routes/endPointsHistorial';
import alergiaRoutes from './routes/endPointsAlergias';
import utensilioRoutes from './routes/endPointsUtensilios';
import recetaRelacionesRoutes from './routes/endpointsRecetasRelaciones';
import unidadesRoutes from './routes/endPointsUnidades';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use('/test', dinoRoutes);
app.use('/api', recetaRoutes);
app.use('/api', ingredienteRoutes);
app.use('/api', comentValRoutes);
app.use('/api', favoritoRoutes);
app.use('/api', favoritoRoutes);
app.use('/api', usuariosRoutes);
app.use('/api', historialRoutes);
app.use('/api', alergiaRoutes);
app.use('/api', utensilioRoutes);
app.use('/api', recetaRelacionesRoutes)
app.use('/api', unidadesRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Recetas API está funcionando');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});