package cl.rednorte.ms_reasignacion.service;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import cl.rednorte.ms_reasignacion.dto.CupoLiberadoRequestDTO;
import cl.rednorte.ms_reasignacion.dto.ReasignacionRequestDTO;
import cl.rednorte.ms_reasignacion.dto.ReasignacionResponseDTO;
import cl.rednorte.ms_reasignacion.entity.CupoLiberado;
import cl.rednorte.ms_reasignacion.entity.Reasignacion;
import cl.rednorte.ms_reasignacion.enums.ReasignacionEstado;
import cl.rednorte.ms_reasignacion.repository.CupoLiberadoRepository;
import cl.rednorte.ms_reasignacion.repository.ReasignacionRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReasignacionService {

    private final CupoLiberadoRepository cupoLiberadoRepository;
    private final ReasignacionRepository reasignacionRepository;

    // --- 1. REGISTRAR CUPO LIBERADO ---
    @Transactional
    public CupoLiberado registrarCupo(CupoLiberadoRequestDTO dto) {
        CupoLiberado cupo = new CupoLiberado();
        cupo.setReservaOriginalId(dto.getReservaOriginalId());
        cupo.setFechaLiberacion(LocalDateTime.now());
        cupo.setMotivoCancelacion(dto.getMotivoCancelacion());
        
        return cupoLiberadoRepository.save(cupo);
    }

    // --- 2. CREAR REASIGNACIÓN (Ofrecer el cupo) ---
    @Transactional
    public ReasignacionResponseDTO crearReasignacion(ReasignacionRequestDTO dto) {
        // Regla 1: El cupo debe existir
        CupoLiberado cupo = cupoLiberadoRepository.findById(dto.getCupoId())
                .orElseThrow(() -> new IllegalArgumentException("El cupo liberado no existe."));

        // Regla 2: No ofrecer el mismo cupo si ya hay una reasignación PENDIENTE
        if (reasignacionRepository.existsByCupoIdAndEstado(cupo.getId(), ReasignacionEstado.PENDIENTE)) {
            throw new IllegalStateException("Este cupo ya está siendo ofrecido a otro paciente y sigue pendiente.");
        }

        Reasignacion reasignacion = new Reasignacion();
        reasignacion.setCupo(cupo);
        reasignacion.setPacienteCandidatoId(dto.getPacienteCandidatoId());
        
        // El servidor controla el tiempo absoluto
        LocalDateTime ahora = LocalDateTime.now();
        reasignacion.setFechaReasignacion(ahora);
        
        // Cálculo de expiración
        reasignacion.setFechaExpiracion(ahora.plusMinutes(dto.getMinutosVigencia()));
        reasignacion.setEstado(ReasignacionEstado.PENDIENTE);

        Reasignacion guardada = reasignacionRepository.save(reasignacion);
        return mapearAResponse(guardada);
    }

    // --- TRADUCTOR A DTO ---
    private ReasignacionResponseDTO mapearAResponse(Reasignacion entidad) {
        ReasignacionResponseDTO dto = new ReasignacionResponseDTO();
        dto.setId(entidad.getId());
        dto.setCupoId(entidad.getCupo().getId());
        dto.setReservaOriginalId(entidad.getCupo().getReservaOriginalId());
        dto.setPacienteCandidatoId(entidad.getPacienteCandidatoId());
        dto.setFechaReasignacion(entidad.getFechaReasignacion());
        dto.setFechaExpiracion(entidad.getFechaExpiracion());
        dto.setEstado(entidad.getEstado());
        return dto;
    }
}