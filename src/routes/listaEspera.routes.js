import { Router } from 'express';
import { listaEsperaController } from '../controllers/listaEspera.controller.js';

const router = Router();

router.post('/cupo-libre', listaEsperaController.registrarCupoLiberado);

export default router;
