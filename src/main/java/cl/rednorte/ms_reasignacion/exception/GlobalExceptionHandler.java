package cl.rednorte.ms_reasignacion.exception;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // Capturamos las excepciones de negocio que lanzamos en el Service
    @ExceptionHandler({IllegalArgumentException.class, IllegalStateException.class})
    public ResponseEntity<Map<String, String>> handleBusinessExceptions(RuntimeException ex) {
        Map<String, String> response = new HashMap<>();
        response.put("mensaje", ex.getMessage());
        
        // Devolvemos un 400 Bad Request, porque el error es por una regla de negocio, no una caída del servidor
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }
}