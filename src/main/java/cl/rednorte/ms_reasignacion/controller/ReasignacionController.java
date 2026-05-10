package cl.rednorte.ms_reasignacion.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import cl.rednorte.ms_reasignacion.dto.CupoLiberadoRequestDTO;
import cl.rednorte.ms_reasignacion.dto.OfertaRequest;
import cl.rednorte.ms_reasignacion.dto.OfertaResponse;
import cl.rednorte.ms_reasignacion.dto.RespuestaPacienteDTO;
import cl.rednorte.ms_reasignacion.entity.CupoLiberado;
import cl.rednorte.ms_reasignacion.service.ReasignacionService;

@RestController
@RequestMapping("/api/reasignaciones")
public class ReasignacionController {

    @Autowired private ReasignacionService reasignacionService;

    // Registrar cupo liberado
    @PostMapping("/cupos")
    public ResponseEntity<?> registrarCupo(@RequestBody CupoLiberadoRequestDTO dto) {
        try {
            CupoLiberado cupo = reasignacionService.registrarCupo(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(cupo);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Crear oferta de reasignación
    @PostMapping
    public ResponseEntity<?> crearOferta(@RequestBody OfertaRequest dto) {
        try {
            OfertaResponse resp = reasignacionService.crearOferta(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(resp);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Respuesta del paciente
    @PatchMapping("/{id}/respuesta")
    public ResponseEntity<?> responder(@PathVariable Long id, @RequestBody RespuestaPacienteDTO dto) {
        try {
            return ResponseEntity.ok(reasignacionService.responderOferta(id, dto));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}