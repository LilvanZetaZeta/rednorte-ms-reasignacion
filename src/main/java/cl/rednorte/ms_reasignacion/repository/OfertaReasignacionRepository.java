package cl.rednorte.ms_reasignacion.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import cl.rednorte.ms_reasignacion.entity.OfertaReasignacion;
import cl.rednorte.ms_reasignacion.enums.OfertaReasignacionEstado;

@Repository
public interface OfertaReasignacionRepository extends JpaRepository<OfertaReasignacion, Long> {

    List<OfertaReasignacion> findByPacienteCandidatoIdAndEstado(Long pacienteId, OfertaReasignacionEstado estado);

    boolean existsByCupoIdAndEstado(Long cupoId, OfertaReasignacionEstado estado);

    List<OfertaReasignacion> findByEstadoAndTiempoLimiteBefore(OfertaReasignacionEstado estado, LocalDateTime fechaActual);
}