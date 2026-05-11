package cl.rednorte.ms_reasignacion.dto;

import lombok.Data;

@Data
public class OfertaRequest {
    private Long cupoId;
    private Long pacienteCandidatoId;
    private Integer minutosVigencia;
}