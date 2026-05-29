import cron from 'node-cron';
import { supabase } from '../config/supabase.js';

export const iniciarCronJobs = () => {
    cron.schedule('* * * * *', async () => {
        try {
            const ahora = new Date().toISOString();

            const { data, error } = await supabase
                .from('oferta_reasignacion')
                .update({ estado: 'EXPIRADA' })
                .eq('estado', 'PENDIENTE')
                .lt('tiempo_limite', ahora)
                .select();

            if (error) throw error;

            if (data && data.length > 0) {
                console.log(`[CRON JOB] Limpieza ejecutada: ${data.length} oferta(s) marcada(s) como EXPIRADA(S).`);
            }
        } catch (err) {
            console.error("[CRON JOB] Error al expirar reasignaciones:", err.message);
        }
    });
    
    console.log("Cron Job de limpieza de reasignaciones inicializado.");
};