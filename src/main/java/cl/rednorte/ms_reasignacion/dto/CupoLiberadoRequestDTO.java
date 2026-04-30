package cl.rednorte.ms_reasignacion.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.UUID;

@Data
public class CupoLiberadoRequestDTO {

    @NotNull(message = "El ID de la reserva original es obligatorio")
    private UUID reservaOriginalId;

    private String motivoCancelacion;
}
