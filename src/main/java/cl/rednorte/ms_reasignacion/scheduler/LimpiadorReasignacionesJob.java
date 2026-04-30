package cl.rednorte.ms_reasignacion.scheduler;

import cl.rednorte.ms_reasignacion.service.ReasignacionService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class LimpiadorReasignacionesJob {

    private final ReasignacionService reasignacionService;

    public LimpiadorReasignacionesJob(ReasignacionService reasignacionService) {
        this.reasignacionService = reasignacionService;
    }

    @Scheduled(fixedRate = 60000)
    public void ejecutarLimpieza() {
        reasignacionService.expirarReasignacionesVencidas();
    }
}
