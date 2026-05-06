package cl.rednorte.ms_reasignacion.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import cl.rednorte.ms_reasignacion.dto.CupoLiberadoRequestDTO;
import cl.rednorte.ms_reasignacion.dto.OfertaRequest;
import cl.rednorte.ms_reasignacion.dto.OfertaResponse;
import cl.rednorte.ms_reasignacion.dto.RespuestaPacienteDTO;
import cl.rednorte.ms_reasignacion.entity.CupoLiberado;
import cl.rednorte.ms_reasignacion.entity.OfertaReasignacion;
import cl.rednorte.ms_reasignacion.enums.OfertaReasignacionEstado;
import cl.rednorte.ms_reasignacion.repository.CupoLiberadoRepository;
import cl.rednorte.ms_reasignacion.repository.OfertaReasignacionRepository;

@Service
public class ReasignacionService {

    @Autowired private CupoLiberadoRepository cupoLiberadoRepository;
    @Autowired private OfertaReasignacionRepository ofertaRepository;

    // 1. Registrar cupo liberado
    @Transactional
    public CupoLiberado registrarCupo(CupoLiberadoRequestDTO dto) {
        CupoLiberado cupo = new CupoLiberado();
        cupo.setReservaOriginalId(dto.getReservaOriginalId());
        cupo.setFechaHoraCupo(LocalDateTime.now());
        return cupoLiberadoRepository.save(cupo);
    }

    // 2. Crear oferta de reasignación
    @Transactional
    public OfertaResponse crearOferta(OfertaRequest dto) {
        CupoLiberado cupo = cupoLiberadoRepository.findById(dto.getCupoId())
                .orElseThrow(() -> new RuntimeException("El cupo liberado no existe."));

        if (ofertaRepository.existsByCupoIdAndEstado(cupo.getId(), OfertaReasignacionEstado.PENDIENTE)) {
            throw new RuntimeException("Este cupo ya está siendo ofrecido a otro paciente.");
        }

        OfertaReasignacion oferta = new OfertaReasignacion();
        oferta.setCupo(cupo);
        oferta.setPacienteCandidatoId(dto.getPacienteCandidatoId());
        oferta.setTiempoLimite(LocalDateTime.now().plusMinutes(dto.getMinutosVigencia()));
        oferta.setEstado(OfertaReasignacionEstado.PENDIENTE);

        return mapearAResponse(ofertaRepository.save(oferta));
    }

    // 3. Respuesta del paciente
    @Transactional
    public OfertaResponse responderOferta(Long id, RespuestaPacienteDTO dto) {
        OfertaReasignacion oferta = ofertaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("La oferta no existe."));

        if (oferta.getEstado() != OfertaReasignacionEstado.PENDIENTE) {
            throw new RuntimeException("Esta oferta ya no es válida. Estado actual: " + oferta.getEstado());
        }

        if (LocalDateTime.now().isAfter(oferta.getTiempoLimite())) {
            oferta.setEstado(OfertaReasignacionEstado.EXPIRADA);
            ofertaRepository.save(oferta);
            throw new RuntimeException("El tiempo para aceptar este cupo ha expirado.");
        }

        oferta.setEstado(dto.getAceptada()
                ? OfertaReasignacionEstado.ACEPTADA
                : OfertaReasignacionEstado.RECHAZADA);

        return mapearAResponse(ofertaRepository.save(oferta));
    }

    // 4. Limpieza automática (CRON)
    @Transactional
    public void expirarOfertasVencidas() {
        List<OfertaReasignacion> vencidas = ofertaRepository.findByEstadoAndTiempoLimiteBefore(
                OfertaReasignacionEstado.PENDIENTE, LocalDateTime.now());

        if (vencidas.isEmpty()) return;

        vencidas.forEach(o -> o.setEstado(OfertaReasignacionEstado.EXPIRADA));
        ofertaRepository.saveAll(vencidas);

        System.out.println("[CRON] " + vencidas.size() + " ofertas marcadas como EXPIRADAS.");
    }

    private OfertaResponse mapearAResponse(OfertaReasignacion o) {
        OfertaResponse r = new OfertaResponse();
        r.setId(o.getId());
        r.setCupoId(o.getCupo().getId());
        r.setReservaOriginalId(o.getCupo().getReservaOriginalId());
        r.setPacienteCandidatoId(o.getPacienteCandidatoId());
        r.setTiempoLimite(o.getTiempoLimite());
        r.setEstado(o.getEstado());
        return r;
    }
}