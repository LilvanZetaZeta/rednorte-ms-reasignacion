import { reasignacionService } from '../services/reasignacion.service.js';

export const reasignacionController = {
    
    crearReasignacion: async (req, res) => {
        try {
            const data = await reasignacionService.crear(req.body);
            return res.status(201).json(data);
        } catch (err) {
            return res.status(400).json({ error: err.message });
        }
    },

    obtenerOfertasPorPaciente: async (req, res) => {
        try {
            const { pacienteId } = req.params;
            const data = await reasignacionService.obtenerPorPaciente(pacienteId);
            return res.status(200).json(data);
        } catch (err) {
            return res.status(400).json({ error: err.message });
        }
    },

    actualizarReasignacion: async (req, res) => {
        try {
            const { id } = req.params;
            const data = await reasignacionService.actualizar(id, req.body);
            return res.status(200).json(data);
        } catch (err) {
            return res.status(400).json({ error: err.message });
        }
    },

    cambiarEstado: async (req, res) => {
        try {
            const { id } = req.params;
            const { estado } = req.body; 
            
            const data = await reasignacionService.cambiarEstado(id, estado);
            return res.status(200).json(data);
        } catch (err) {
            // Error específico si falla el microservicio de Java destino
            if (err.message.includes("ms-gestion")) {
                return res.status(502).json({ error: "Bad Gateway", detalle: err.message });
            }
            return res.status(400).json({ error: err.message });
        }
    },

    eliminarReasignacion: async (req, res) => {
        try {
            const { id } = req.params;
            await reasignacionService.eliminar(id);
            return res.status(204).send();
        } catch (err) {
            return res.status(400).json({ error: err.message });
        }
    }
};