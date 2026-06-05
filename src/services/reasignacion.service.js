// src/services/reasignacion.service.js
import { supabase } from '../config/supabase.js';

export const reasignacionService = {
    
    crear: async ({ cupoId, pacienteCandidatoId, estado, minutosVigencia = 30 }) => {
        const fechaLimite = new Date();
        fechaLimite.setMinutes(fechaLimite.getMinutes() + minutosVigencia);

        const { data, error } = await supabase
            .from('oferta_reasignacion')
            .insert([{ 
                cupo_id: cupoId, 
                paciente_candidato_id: pacienteCandidatoId, 
                estado: estado || 'PENDIENTE',
                tiempo_limite: fechaLimite.toISOString()
            }])
            .select()
            .single();

        if (error) throw new Error(error.message);
        return data;
    },

    obtenerPorPaciente: async (pacienteId) => {
        const { data, error } = await supabase
            .from('oferta_reasignacion')
            .select('*')
            .eq('paciente_candidato_id', pacienteId)
            .eq('estado', 'PENDIENTE');

        if (error) throw new Error(error.message);
        return data || [];
    },

    actualizar: async (id, { cupoId, pacienteCandidatoId, estado }) => {
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

        if (error) throw new Error(error.message);
        return data;
    },

    cambiarEstado: async (id, estado) => {
        // 1. Actualización local en Supabase
        const { data, error } = await supabase
            .from('oferta_reasignacion')
            .update({ estado })
            .eq('id', id)
            .select()
            .single();

        if (error) throw new Error(error.message);

        // 2. Orquestación de eventos inter-microservicios
        if (estado === 'ACEPTADA') {
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
                throw new Error("Falló la sincronización con ms-gestion al oficializar la reserva.");
            }
        }

        return data;
    },

    eliminar: async (id) => {
        const { error } = await supabase
            .from('oferta_reasignacion')
            .delete()
            .eq('id', id);

        if (error) throw new Error(error.message);
        return true;
    }
};