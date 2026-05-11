package cl.rednorte.ms_reasignacion.scheduler;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import cl.rednorte.ms_reasignacion.service.ReasignacionService;

@Component
public class LimpiadorReasignacionesJob {

    @Autowired
    private ReasignacionService reasignacionService;

    @Scheduled(fixedRate = 60000)
    public void ejecutarLimpieza() {
        reasignacionService.expirarOfertasVencidas();
    }
}