package cl.rednorte.ms_reasignacion.entity;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "cupos_liberados")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class CupoLiberado {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    // Referencia al ID de la reserva que se canceló en ms-registro
    @Column(name = "reserva_original_id", nullable = false)
    private UUID reservaOriginalId;

    @Column(name = "fecha_liberacion", nullable = false)
    private LocalDateTime fechaLiberacion;

    @Column(name = "motivo_cancelacion")
    private String motivoCancelacion;

    @Column(name = "creado_en", insertable = false, updatable = false)
    private LocalDateTime creadoEn;
}