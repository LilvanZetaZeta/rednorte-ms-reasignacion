package cl.rednorte.ms_reasignacion.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RespuestaPacienteDTO {

    @NotNull(message = "Debe indicar explícitamente si acepta (true) o rechaza (false) el cupo.")
    private Boolean aceptada;
    
}