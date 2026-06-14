import { listaEsperaService } from '../services/listaEspera.service.js';

export const listaEsperaController = {

    registrarCupoLiberado: async (req, res) => {
        const { reservaOriginalId, centroId, especialidad, fechaHora } = req.body;

        if (!reservaOriginalId || !centroId || !especialidad || !fechaHora) {
            return res.status(400).json({
                error: 'Faltan campos obligatorios: reservaOriginalId, centroId, especialidad, fechaHora',
            });
        }

        try {
            const resultado = await listaEsperaService.procesarCupoLiberado(req.body);

            return res.status(202).json({
                ok: true,
                message: 'Evento de cupo liberado procesado correctamente.',
                detalle: resultado,
            });
        } catch (error) {
            return res.status(500).json({
                error: 'No fue posible procesar el evento de cupo liberado',
                detalle: error.message,
            });
        }
    },
};