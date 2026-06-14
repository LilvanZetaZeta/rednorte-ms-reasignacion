import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { iniciarCronJobs } from './scheduler/cron.js';

const PORT = process.env.PORT || 8083;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`MS-Reasignacion (Node.js) corriendo en http://0.0.0.0:${PORT}`);
    iniciarCronJobs();
});