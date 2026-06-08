import { supabase } from '../config/supabase.js';
import { reasignacionService } from './reasignacion.service.js';

export const listaEsperaService = {

    procesarCupoLiberado: async (evento) => {
        const { reservaOriginalId, centroId, especialidad, fechaHora } = evento;

        // 1. Insertar el cupo liberado en la tabla cupo_liberado
        const { data: cupo, error: errorCupo } = await supabase
            .from('cupo_liberado')
            .insert([{
                reserva_original_id: reservaOriginalId,
                fecha_hora_cupo: fechaHora,
            }])
            .select()
            .single();

        if (errorCupo) throw new Error(`Error al registrar cupo liberado: ${errorCupo.message}`);

        // 2. Buscar candidato por centro + especialidad (prioridad más alta primero)
        let candidato = null;

        const { data: candidatosPorEspecialidad, error: errorEsp } = await supabase
            .from('lista_espera_local')
            .select('*')
            .eq('centro_id', centroId)
            .eq('especialidad', especialidad)
            .order('prioridad', { ascending: true })
            .limit(1);

        if (errorEsp) throw new Error(`Error al buscar candidato por especialidad: ${errorEsp.message}`);

        if (candidatosPorEspecialidad && candidatosPorEspecialidad.length > 0) {
            candidato = candidatosPorEspecialidad[0];
        }

        // 3. Si no hay candidato con esa especialidad, buscar solo por centro
        if (!candidato) {
            const { data: candidatosPorCentro, error: errorCentro } = await supabase
                .from('lista_espera_local')
                .select('*')
                .eq('centro_id', centroId)
                .order('prioridad', { ascending: true })
                .limit(1);

            if (errorCentro) throw new Error(`Error al buscar candidato por centro: ${errorCentro.message}`);

            if (candidatosPorCentro && candidatosPorCentro.length > 0) {
                candidato = candidatosPorCentro[0];
            }
        }

        // 4. Si no hay nadie en lista de espera, terminar sin crear oferta
        if (!candidato) {
            return {
                procesado: true,
                cupoId: cupo.id,
                mensaje: 'Cupo registrado pero no hay pacientes en lista de espera para este centro.',
            };
        }

        // 5. Crear la oferta de reasignación para el candidato encontrado
        const oferta = await reasignacionService.crear({
            cupoId: cupo.id,
            pacienteCandidatoId: candidato.paciente_id,
            estado: 'PENDIENTE',
            minutosVigencia: 30,
        });

        return {
            procesado: true,
            cupoId: cupo.id,
            candidatoId: candidato.paciente_id,
            ofertaId: oferta.id,
            mensaje: 'Oferta de reasignación creada exitosamente.',
        };
    },
};