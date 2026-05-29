import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import reasignacionRoutes from './routes/reasignacion.routes.js';

import { iniciarCronJobs } from './scheduler/cron.js'; 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8083;

app.use(cors());
app.use(express.json());

// Ruta en plural para coincidir con tu API Gateway
app.use('/api/reasignaciones', reasignacionRoutes);

app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada en MS Reasignacion' });
});

// Forzamos 0.0.0.0 para que Java (Gateway) pueda encontrar el puerto
app.listen(PORT, '0.0.0.0', () => {
    console.log(`MS-Reasignacion (Node.js) corriendo en http://0.0.0.0:${PORT}`);
    iniciarCronJobs(); 
});