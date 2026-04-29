package cl.rednorte.ms_reasignacion.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import cl.rednorte.ms_reasignacion.entity.CupoLiberado;

@Repository
public interface CupoLiberadoRepository extends JpaRepository<CupoLiberado, UUID> {
    // Aquí podríamos agregar métodos para buscar cupos por fecha si fuera necesario
}