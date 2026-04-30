package cl.rednorte.ms_reasignacion.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.UUID;

@Data
public class ReasignacionRequestDTO {

    @NotNull(message = "El ID del cupo liberado es obligatorio")
    private UUID cupoId;

    @NotNull(message = "El ID del paciente candidato es obligatorio")
    private UUID pacienteCandidatoId;

    @NotNull(message = "Debe especificar los minutos de vigencia de la reasignación")
    private Integer minutosVigencia;
}
