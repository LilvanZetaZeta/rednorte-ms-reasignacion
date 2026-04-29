package cl.rednorte.ms_reasignacion.dto;

import cl.rednorte.ms_reasignacion.enums.ReasignacionEstado;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class ReasignacionResponseDTO {
    private UUID id;
    private UUID cupoId;
    private UUID reservaOriginalId;
    private UUID pacienteCandidatoId;
    private LocalDateTime fechaReasignacion;
    private LocalDateTime fechaExpiracion;
    private ReasignacionEstado estado;
}
