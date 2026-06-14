import request from 'supertest';
import { jest } from '@jest/globals';

// --- MOCK DE SUPABASE ---
const mockFrom = jest.fn();
jest.unstable_mockModule('../src/config/supabase.js', () => ({
    supabase: { from: mockFrom },
}));

// --- MOCK DEL CRON ---
jest.unstable_mockModule('../src/scheduler/cron.js', () => ({
    iniciarCronJobs: jest.fn(),
}));

const { default: app } = await import('../src/app.js');
beforeEach(() => {
    jest.clearAllMocks();
});

// =========================================================
// POST /api/reasignaciones/cupo-libre
// =========================================================
describe('POST /api/reasignaciones/cupo-libre', () => {

    test('debe registrar el cupo, encontrar candidato por especialidad y crear oferta', async () => {
        const cupoInsertado = {
            id: 99,
            reserva_original_id: 10,
            fecha_hora_cupo: '2026-07-01T10:00:00',
        };

        const candidato = {
            id: 1,
            centro_id: 2,
            paciente_id: 5,
            especialidad: 'CARDIOLOGIA',
            prioridad: 1,
        };

        const ofertaCreada = {
            id: 50,
            cupo_id: 99,
            paciente_candidato_id: 5,
            estado: 'PENDIENTE',
            tiempo_limite: new Date(Date.now() + 30 * 60000).toISOString(),
        };

        // Mock 1: INSERT en cupo_liberado
        mockFrom.mockReturnValueOnce({
            insert: jest.fn(() => ({
                select: jest.fn(() => ({
                    single: jest.fn().mockResolvedValueOnce({ data: cupoInsertado, error: null }),
                })),
            })),
        });

        // Mock 2: SELECT en lista_espera_local por centro + especialidad
        mockFrom.mockReturnValueOnce({
            select: jest.fn(() => ({
                eq: jest.fn(() => ({
                    eq: jest.fn(() => ({
                        order: jest.fn(() => ({
                            limit: jest.fn().mockResolvedValueOnce({ data: [candidato], error: null }),
                        })),
                    })),
                })),
            })),
        });

        // Mock 3: INSERT en oferta_reasignacion
        mockFrom.mockReturnValueOnce({
            insert: jest.fn(() => ({
                select: jest.fn(() => ({
                    single: jest.fn().mockResolvedValueOnce({ data: ofertaCreada, error: null }),
                })),
            })),
        });

        const response = await request(app)
            .post('/api/reasignaciones/cupo-libre')
            .send({
                reservaOriginalId: 10,
                centroId: 2,
                especialidad: 'CARDIOLOGIA',
                fechaHora: '2026-07-01T10:00:00',
            });

        expect(response.statusCode).toBe(202);
        expect(response.body.ok).toBe(true);
        expect(response.body.detalle.cupoId).toBe(99);
        expect(response.body.detalle.candidatoId).toBe(5);
        expect(response.body.detalle.ofertaId).toBe(50);
    });

    test('debe crear oferta usando fallback por centro cuando no hay candidato por especialidad', async () => {
        const cupoInsertado = {
            id: 100,
            reserva_original_id: 11,
            fecha_hora_cupo: '2026-07-02T09:00:00',
        };

        const candidatoPorCentro = {
            id: 2,
            centro_id: 2,
            paciente_id: 8,
            especialidad: 'MEDICINA_GENERAL',
            prioridad: 1,
        };

        const ofertaCreada = {
            id: 51,
            cupo_id: 100,
            paciente_candidato_id: 8,
            estado: 'PENDIENTE',
            tiempo_limite: new Date(Date.now() + 30 * 60000).toISOString(),
        };

        // Mock 1: INSERT en cupo_liberado
        mockFrom.mockReturnValueOnce({
            insert: jest.fn(() => ({
                select: jest.fn(() => ({
                    single: jest.fn().mockResolvedValueOnce({ data: cupoInsertado, error: null }),
                })),
            })),
        });

        // Mock 2: SELECT por especialidad — sin resultados
        mockFrom.mockReturnValueOnce({
            select: jest.fn(() => ({
                eq: jest.fn(() => ({
                    eq: jest.fn(() => ({
                        order: jest.fn(() => ({
                            limit: jest.fn().mockResolvedValueOnce({ data: [], error: null }),
                        })),
                    })),
                })),
            })),
        });

        // Mock 3: SELECT por centro — con candidato
        mockFrom.mockReturnValueOnce({
            select: jest.fn(() => ({
                eq: jest.fn(() => ({
                    order: jest.fn(() => ({
                        limit: jest.fn().mockResolvedValueOnce({ data: [candidatoPorCentro], error: null }),
                    })),
                })),
            })),
        });

        // Mock 4: INSERT en oferta_reasignacion
        mockFrom.mockReturnValueOnce({
            insert: jest.fn(() => ({
                select: jest.fn(() => ({
                    single: jest.fn().mockResolvedValueOnce({ data: ofertaCreada, error: null }),
                })),
            })),
        });

        const response = await request(app)
            .post('/api/reasignaciones/cupo-libre')
            .send({
                reservaOriginalId: 11,
                centroId: 2,
                especialidad: 'CARDIOLOGIA',
                fechaHora: '2026-07-02T09:00:00',
            });

        expect(response.statusCode).toBe(202);
        expect(response.body.ok).toBe(true);
        expect(response.body.detalle.cupoId).toBe(100);
        expect(response.body.detalle.candidatoId).toBe(8);
        expect(response.body.detalle.ofertaId).toBe(51);
    });

    test('debe registrar el cupo y retornar mensaje cuando no hay nadie en lista de espera', async () => {
        const cupoInsertado = {
            id: 101,
            reserva_original_id: 12,
            fecha_hora_cupo: '2026-07-03T11:00:00',
        };

        // Mock 1: INSERT en cupo_liberado
        mockFrom.mockReturnValueOnce({
            insert: jest.fn(() => ({
                select: jest.fn(() => ({
                    single: jest.fn().mockResolvedValueOnce({ data: cupoInsertado, error: null }),
                })),
            })),
        });

        // Mock 2: SELECT por especialidad — sin resultados
        mockFrom.mockReturnValueOnce({
            select: jest.fn(() => ({
                eq: jest.fn(() => ({
                    eq: jest.fn(() => ({
                        order: jest.fn(() => ({
                            limit: jest.fn().mockResolvedValueOnce({ data: [], error: null }),
                        })),
                    })),
                })),
            })),
        });

        // Mock 3: SELECT por centro — sin resultados
        mockFrom.mockReturnValueOnce({
            select: jest.fn(() => ({
                eq: jest.fn(() => ({
                    order: jest.fn(() => ({
                        limit: jest.fn().mockResolvedValueOnce({ data: [], error: null }),
                    })),
                })),
            })),
        });

        const response = await request(app)
            .post('/api/reasignaciones/cupo-libre')
            .send({
                reservaOriginalId: 12,
                centroId: 3,
                especialidad: 'NEUROLOGIA',
                fechaHora: '2026-07-03T11:00:00',
            });

        expect(response.statusCode).toBe(202);
        expect(response.body.ok).toBe(true);
        expect(response.body.detalle.mensaje).toContain('no hay pacientes en lista de espera');
    });

    test('debe retornar 400 si faltan campos obligatorios en el body', async () => {
        const response = await request(app)
            .post('/api/reasignaciones/cupo-libre')
            .send({
                centroId: 2,
                especialidad: 'CARDIOLOGIA',
                // falta reservaOriginalId y fechaHora
            });

        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('error');
    });

    test('debe retornar 500 si Supabase falla al insertar el cupo', async () => {
        // Mock 1: INSERT en cupo_liberado falla
        mockFrom.mockReturnValueOnce({
            insert: jest.fn(() => ({
                select: jest.fn(() => ({
                    single: jest.fn().mockResolvedValueOnce({
                        data: null,
                        error: { message: 'Error de conexión con Supabase' },
                    }),
                })),
            })),
        });

        const response = await request(app)
            .post('/api/reasignaciones/cupo-libre')
            .send({
                reservaOriginalId: 13,
                centroId: 2,
                especialidad: 'CARDIOLOGIA',
                fechaHora: '2026-07-04T08:00:00',
            });

        expect(response.statusCode).toBe(500);
        expect(response.body).toHaveProperty('error');
    });
});