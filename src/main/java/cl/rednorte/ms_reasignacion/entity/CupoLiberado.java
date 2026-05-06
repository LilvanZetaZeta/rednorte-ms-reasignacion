package cl.rednorte.ms_reasignacion.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "cupo_liberado")
public class CupoLiberado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "reserva_original_id", nullable = false)
    private Long reservaOriginalId;

    @Column(name = "fecha_hora_cupo", nullable = false)
    private LocalDateTime fechaHoraCupo;
}