package cl.rednorte.ms_reasignacion.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.Data;

@Data
public class CupoLiberadoResponseDTO {
    private UUID id;
    private UUID reservaOriginalId;
    private LocalDateTime fechaLiberacion;
    private String motivoCancelacion;
}