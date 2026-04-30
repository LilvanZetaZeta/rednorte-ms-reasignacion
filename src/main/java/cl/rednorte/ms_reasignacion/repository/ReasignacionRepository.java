package cl.rednorte.ms_reasignacion.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import cl.rednorte.ms_reasignacion.entity.Reasignacion;
import cl.rednorte.ms_reasignacion.enums.ReasignacionEstado;

@Repository
public interface ReasignacionRepository extends JpaRepository<Reasignacion, UUID> {
    
    // Para buscar todas las reasignaciones pendientes de un paciente específico
    List<Reasignacion> findByPacienteCandidatoIdAndEstado(UUID pacienteId, ReasignacionEstado estado);
    
    // Para verificar si un cupo ya tiene una reasignación en curso
    boolean existsByCupoIdAndEstado(UUID cupoId, ReasignacionEstado estado);

    // Para buscar todas las reasignaciones pendientes cuya fecha de expiración ya pasó
    List<Reasignacion> findByEstadoAndFechaExpiracionBefore(ReasignacionEstado estado, LocalDateTime fechaActual);
}