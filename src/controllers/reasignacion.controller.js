import { supabase } from '../config/supabase.js';

export const reasignacionController = {
    
    // POST: Crear reasignacion
    crearReasignacion: async (req, res) => {
        // Añadimos 'minutosVigencia' al destructuring, o usamos 30 por defecto
        const { cupoId, pacienteCandidatoId, estado, minutosVigencia = 30 } = req.body;
        
        // Lógica de negocio: Calculamos el tiempo límite exacto
        const fechaLimite = new Date();
        fechaLimite.setMinutes(fechaLimite.getMinutes() + minutosVigencia);

        const { data, error } = await supabase
            .from('oferta_reasignacion')
            .insert([{ 
                cupo_id: cupoId, 
                paciente_candidato_id: pacienteCandidatoId, 
                estado: estado || 'PENDIENTE',
                tiempo_limite: fechaLimite.toISOString() // <- ESTE ES EL ARREGLO CRÍTICO
            }])
            .select()
            .single();

        if (error) return res.status(400).json({ error: error.message });
        return res.status(201).json(data);
    },
    
    // GET: Obtener las ofertas activas de un paciente específico
    obtenerOfertasPorPaciente: async (req, res) => {
        const { pacienteId } = req.params;

        const { data, error } = await supabase
            .from('oferta_reasignacion')
            .select('*')
            .eq('paciente_candidato_id', pacienteId)
            .eq('estado', 'PENDIENTE'); // Solo le mostramos las que aún puede aceptar

        if (error) return res.status(400).json({ error: error.message });
        
        // Si no hay datos, devolvemos un array vacío para que el frontend no colapse
        return res.status(200).json(data || []);
    },

    // PUT: Actualizar registro completo
    actualizarReasignacion: async (req, res) => {
        const { id } = req.params;
        const { cupoId, pacienteCandidatoId, estado } = req.body;
        
        const { data, error } = await supabase
            .from('oferta_reasignacion')
            .update({ 
                cupo_id: cupoId, 
                paciente_candidato_id: pacienteCandidatoId, 
                estado 
            })
            .eq('id', id)
            .select()
            .single();

        if (error) return res.status(400).json({ error: error.message });
        return res.status(200).json(data);
    },

    // PATCH: Actualizar solo un campo (estado)
    cambiarEstado: async (req, res) => {
        const { id } = req.params;
        const { estado } = req.body; 
        
        try {
            // 1. Actualizamos el estado en nuestra BD de reasignación
            const { data, error } = await supabase
                .from('oferta_reasignacion')
                .update({ estado })
                .eq('id', id)
                .select()
                .single();

            if (error) return res.status(400).json({ error: error.message });

            // 2. LÓGICA CRÍTICA: Comunicación entre microservicios
            if (estado === 'ACEPTADA') {
                // Si acepta, debemos avisarle a ms-gestion para que haga efectivo el cambio.
                // Reemplaza la URL por el endpoint real de tu ms-gestion que transfiere la cita
                const msGestionUrl = process.env.MS_GESTION_URL || 'http://ms-gestion-app:8081';
                
                const respuestaGestion = await fetch(`${msGestionUrl}/api/gestion/reservas/transferir`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        cupoId: data.cupo_id,
                        nuevoPacienteId: data.paciente_candidato_id
                    })
                });

                if (!respuestaGestion.ok) {
                    console.error("[CRÍTICO] Falló la sincronización con ms-gestion");
                    // Aquí podrías implementar lógica de compensación (revertir la aceptación)
                }
            }

            return res.status(200).json(data);

        } catch (err) {
            return res.status(500).json({ error: "Error interno del servidor", detalle: err.message });
        }
    },
    // DELETE: Borrado fisico de la base de datos
    eliminarReasignacion: async (req, res) => {
        const { id } = req.params;
        
        const { error } = await supabase
            .from('oferta_reasignacion')
            .delete()
            .eq('id', id);

        if (error) return res.status(400).json({ error: error.message });
        return res.status(204).send();
    }
};