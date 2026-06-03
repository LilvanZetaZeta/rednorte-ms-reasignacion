export const listaEsperaController = {
  registrarCupoLiberado: async (req, res) => {
    try {
      const evento = req.body;
      console.log('[ms-reasignacion] Cupo liberado recibido:', evento);
      return res.status(202).json({
        ok: true,
        message: 'Evento de cupo liberado registrado para procesamiento reactivo.',
        evento,
      });
    } catch (error) {
      return res.status(500).json({ error: 'No fue posible procesar el evento de cupo liberado', detalle: error.message });
    }
  },
};
