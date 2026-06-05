export const listaEsperaService = {
    procesarCupoLiberado: async (evento) => {
        
        console.log('[ms-reasignacion] Cupo liberado recibido en capa de servicio:', evento);
        
        
        return {
            procesado: true,
            eventoRegistrado: evento
        };
    }
};

//por ahora no hace nada pero es que me dio paja hacer todo esto lo hago mañana(ola profe xd)