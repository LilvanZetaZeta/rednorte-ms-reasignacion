package cl.rednorte.ms_reasignacion.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import cl.rednorte.ms_reasignacion.dto.CupoLiberadoRequestDTO;
import cl.rednorte.ms_reasignacion.dto.ReasignacionRequestDTO;
import cl.rednorte.ms_reasignacion.dto.ReasignacionResponseDTO;
import cl.rednorte.ms_reasignacion.entity.CupoLiberado;
import cl.rednorte.ms_reasignacion.service.ReasignacionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/reasignaciones")
@RequiredArgsConstructor
public class ReasignacionController {

    private final ReasignacionService reasignacionService;

    // --- 1. NOTIFICAR CUPO LIBERADO ---
    // Este endpoint lo llamaría el ms-registro o un admin
    @PostMapping("/cupos")
    public ResponseEntity<CupoLiberado> registrarCupo(@Valid @RequestBody CupoLiberadoRequestDTO dto) {
        return new ResponseEntity<>(reasignacionService.registrarCupo(dto), HttpStatus.CREATED);
    }

    // --- 2. CREAR UNA REASIGNACIÓN ---
    // Ofrece el cupo a un paciente de la lista de espera
    @PostMapping
    public ResponseEntity<ReasignacionResponseDTO> crearReasignacion(@Valid @RequestBody ReasignacionRequestDTO dto) {
        return new ResponseEntity<>(reasignacionService.crearReasignacion(dto), HttpStatus.CREATED);
    }
}