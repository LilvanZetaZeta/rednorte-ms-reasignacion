package cl.rednorte.ms_reasignacion.entity;

import java.time.LocalDateTime;
import java.util.UUID;

import cl.rednorte.ms_reasignacion.enums.ReasignacionEstado;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "reasignaciones")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class Reasignacion {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cupo_id", nullable = false)
    private CupoLiberado cupo;

    @Column(name = "paciente_candidato_id", nullable = false)
    private UUID pacienteCandidatoId;

    @Column(name = "fecha_reasignacion", nullable = false)
    private LocalDateTime fechaReasignacion;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ReasignacionEstado estado = ReasignacionEstado.PENDIENTE;

    @Column(name = "fecha_expiracion")
    private LocalDateTime fechaExpiracion;
}
