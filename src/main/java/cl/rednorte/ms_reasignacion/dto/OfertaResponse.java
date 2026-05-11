package cl.rednorte.ms_reasignacion.dto;

import java.time.LocalDateTime;

import cl.rednorte.ms_reasignacion.enums.OfertaReasignacionEstado;
import lombok.Data;

@Data
public class OfertaResponse {
    private Long id;
    private Long cupoId;
    private Long reservaOriginalId;
    private Long pacienteCandidatoId;
    private LocalDateTime tiempoLimite;
    private OfertaReasignacionEstado estado;
}