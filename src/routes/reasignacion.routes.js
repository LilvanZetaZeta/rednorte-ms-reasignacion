import { Router } from 'express';
import { reasignacionController } from '../controllers/reasignacion.controller.js';

const router = Router();

router.post('/', reasignacionController.crearReasignacion);
router.get('/paciente/:pacienteId', reasignacionController.obtenerOfertasPorPaciente);
router.put('/:id', reasignacionController.actualizarReasignacion);
router.patch('/:id', reasignacionController.cambiarEstado);
router.delete('/:id', reasignacionController.eliminarReasignacion);


export default router;