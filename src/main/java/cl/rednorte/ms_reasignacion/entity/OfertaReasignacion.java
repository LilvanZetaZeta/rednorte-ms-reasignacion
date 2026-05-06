package cl.rednorte.ms_reasignacion.entity;


import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import cl.rednorte.ms_reasignacion.enums.OfertaReasignacionEstado;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;


@Data
@Entity
@Table(name = "oferta_reasignacion")
public class OfertaReasignacion {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "cupo_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private CupoLiberado cupo;


    @Column(name = "paciente_candidato_id", nullable = false)
    private Long pacienteCandidatoId;


    @Enumerated(EnumType.STRING)
    @Column(name = "estado", nullable = false, length = 20)
    private OfertaReasignacionEstado estado = OfertaReasignacionEstado.PENDIENTE;


    @Column(name = "tiempo_limite", nullable = false)
    private LocalDateTime tiempoLimite;
}
