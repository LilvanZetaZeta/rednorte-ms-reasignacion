package cl.rednorte.ms_reasignacion;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class MsReasignacionApplication {

    public static void main(String[] args) {
        SpringApplication.run(MsReasignacionApplication.class, args);
    }
}