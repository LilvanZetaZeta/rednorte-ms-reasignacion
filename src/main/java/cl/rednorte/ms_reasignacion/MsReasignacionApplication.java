package cl.rednorte.ms_reasignacion;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication
public class MsReasignacionApplication {

    public static void main(String[] args) {
        // 1. Cargar el archivo .env puro 
        // El "ignoreIfMissing()" es vital para cuando uses Docker a futuro.
        Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();
        
        // 2. Inyectar cada variable forzosamente en las propiedades del Sistema
        dotenv.entries().forEach(entry -> System.setProperty(entry.getKey(), entry.getValue()));

        // 3. Ahora sí, despertar a Spring Boot (que leerá las propiedades del sistema)
        SpringApplication.run(MsReasignacionApplication.class, args);
    }
}