import express from 'express';
import cors from 'cors';
import reasignacionRoutes from './routes/reasignacion.routes.js';
import listaEsperaRoutes from './routes/listaEspera.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/reasignaciones', reasignacionRoutes);
app.use('/api/reasignaciones', listaEsperaRoutes);

app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada en MS Reasignacion' });
});

export default app;