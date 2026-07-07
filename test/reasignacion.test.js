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

// --- MOCK DE FETCH ---
const mockFetch = jest.fn().mockResolvedValue({ ok: true });
global.fetch = mockFetch;

const { default: app } = await import('../src/app.js');
beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockClear();
    mockFetch.mockResolvedValue({ ok: true });
});

// =========================================================
// POST /api/reasignaciones
// =========================================================
describe('POST /api/reasignaciones', () => {

    test('debe crear una oferta de reasignación correctamente', async () => {
        const ofertaCreada = {
            id: 1,
            cupo_id: 10,
            paciente_candidato_id: 'uuid-paciente-123',
            estado: 'PENDIENTE',
            tiempo_limite: new Date(Date.now() + 30 * 60000).toISOString(),
        };

        mockFrom.mockReturnValueOnce({
            insert: jest.fn(() => ({
                select: jest.fn(() => ({
                    single: jest.fn().mockResolvedValueOnce({ data: ofertaCreada, error: null }),
                })),
            })),
        });

        const response = await request(app)
            .post('/api/reasignaciones')
            .send({
                cupoId: 10,
                pacienteCandidatoId: 'uuid-paciente-123',
                estado: 'PENDIENTE',
                minutosVigencia: 30,
            });

        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.estado).toBe('PENDIENTE');
        expect(response.body.cupo_id).toBe(10);
    });

    test('debe retornar 400 si Supabase lanza un error al insertar', async () => {
        mockFrom.mockReturnValueOnce({
            insert: jest.fn(() => ({
                select: jest.fn(() => ({
                    single: jest.fn().mockResolvedValueOnce({
                        data: null,
                        error: { message: 'Error de inserción en Supabase' },
                    }),
                })),
            })),
        });

        const response = await request(app)
            .post('/api/reasignaciones')
            .send({
                cupoId: 10,
                pacienteCandidatoId: 'uuid-paciente-123',
            });

        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('error');
    });
});

// =========================================================
// GET /api/reasignaciones/paciente/:pacienteId
// =========================================================
describe('GET /api/reasignaciones/paciente/:pacienteId', () => {

    test('debe retornar las ofertas pendientes de un paciente', async () => {
        const ofertas = [
            { id: 1, cupo_id: 10, paciente_candidato_id: 'uuid-paciente-123', estado: 'PENDIENTE' },
            { id: 2, cupo_id: 11, paciente_candidato_id: 'uuid-paciente-123', estado: 'PENDIENTE' },
        ];

        mockFrom.mockReturnValueOnce({
            select: jest.fn(() => ({
                eq: jest.fn(() => ({
                    eq: jest.fn().mockResolvedValueOnce({ data: ofertas, error: null }),
                })),
            })),
        });

        const response = await request(app)
            .get('/api/reasignaciones/paciente/uuid-paciente-123');

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body).toHaveLength(2);
    });

    test('debe retornar un arreglo vacío si el paciente no tiene ofertas pendientes', async () => {
        mockFrom.mockReturnValueOnce({
            select: jest.fn(() => ({
                eq: jest.fn(() => ({
                    eq: jest.fn().mockResolvedValueOnce({ data: [], error: null }),
                })),
            })),
        });

        const response = await request(app)
            .get('/api/reasignaciones/paciente/uuid-sin-ofertas');

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual([]);
    });
});

// =========================================================
// PUT /api/reasignaciones/:id
// =========================================================
describe('PUT /api/reasignaciones/:id', () => {

    test('debe actualizar una oferta de reasignación correctamente', async () => {
        const ofertaActualizada = {
            id: 1,
            cupo_id: 20,
            paciente_candidato_id: 'uuid-paciente-456',
            estado: 'PENDIENTE',
        };

        mockFrom.mockReturnValueOnce({
            update: jest.fn(() => ({
                eq: jest.fn(() => ({
                    select: jest.fn(() => ({
                        single: jest.fn().mockResolvedValueOnce({ data: ofertaActualizada, error: null }),
                    })),
                })),
            })),
        });

        const response = await request(app)
            .put('/api/reasignaciones/1')
            .send({
                cupoId: 20,
                pacienteCandidatoId: 'uuid-paciente-456',
                estado: 'PENDIENTE',
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.cupo_id).toBe(20);
        expect(response.body.paciente_candidato_id).toBe('uuid-paciente-456');
    });

    test('debe retornar 400 si Supabase lanza un error al actualizar', async () => {
        mockFrom.mockReturnValueOnce({
            update: jest.fn(() => ({
                eq: jest.fn(() => ({
                    select: jest.fn(() => ({
                        single: jest.fn().mockResolvedValueOnce({
                            data: null,
                            error: { message: 'Registro no encontrado' },
                        }),
                    })),
                })),
            })),
        });

        const response = await request(app)
            .put('/api/reasignaciones/9999')
            .send({
                cupoId: 20,
                pacienteCandidatoId: 'uuid-paciente-456',
                estado: 'PENDIENTE',
            });

        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('error');
    });
});

// =========================================================
// PATCH /api/reasignaciones/:id
// =========================================================
describe('PATCH /api/reasignaciones/:id', () => {

    test('debe cambiar el estado a ACEPTADA correctamente', async () => {
        const ofertaAceptada = {
            id: 1,
            cupo_id: 10,
            paciente_candidato_id: 'uuid-paciente-123',
            estado: 'ACEPTADA',
        };

        mockFrom.mockReturnValueOnce({
            update: jest.fn(() => ({
                eq: jest.fn(() => ({
                    select: jest.fn(() => ({
                        single: jest.fn().mockResolvedValueOnce({ data: ofertaAceptada, error: null }),
                    })),
                })),
            })),
        });

        const response = await request(app)
            .patch('/api/reasignaciones/1')
            .send({ estado: 'ACEPTADA' });

        expect(response.statusCode).toBe(200);
        expect(response.body.estado).toBe('ACEPTADA');
        expect(mockFetch).toHaveBeenCalledTimes(1);
        expect(mockFetch).toHaveBeenCalledWith(
            'http://ms-gestion-app:8081/api/gestion/reservas/transferir',
            expect.objectContaining({
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    cupoId: 10,
                    nuevoPacienteId: 'uuid-paciente-123'
                })
            })
        );
    });

    test('debe cambiar el estado a RECHAZADA correctamente', async () => {
        const ofertaRechazada = {
            id: 1,
            cupo_id: 10,
            paciente_candidato_id: 'uuid-paciente-123',
            estado: 'RECHAZADA',
        };

        mockFrom.mockReturnValueOnce({
            update: jest.fn(() => ({
                eq: jest.fn(() => ({
                    select: jest.fn(() => ({
                        single: jest.fn().mockResolvedValueOnce({ data: ofertaRechazada, error: null }),
                    })),
                })),
            })),
        });

        const response = await request(app)
            .patch('/api/reasignaciones/1')
            .send({ estado: 'RECHAZADA' });

        expect(response.statusCode).toBe(200);
        expect(response.body.estado).toBe('RECHAZADA');
    });

    test('debe retornar 400 si el estado enviado no es válido', async () => {
        const response = await request(app)
            .patch('/api/reasignaciones/1')
            .send({ estado: 'ESTADO_INVENTADO' });

        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('error');
    });
});

// =========================================================
// DELETE /api/reasignaciones/:id
// =========================================================
describe('DELETE /api/reasignaciones/:id', () => {

    test('debe eliminar una oferta y retornar 204', async () => {
        mockFrom.mockReturnValueOnce({
            delete: jest.fn(() => ({
                eq: jest.fn().mockResolvedValueOnce({ error: null }),
            })),
        });

        const response = await request(app)
            .delete('/api/reasignaciones/1');

        expect(response.statusCode).toBe(204);
    });

    test('debe retornar 400 si Supabase lanza un error al eliminar', async () => {
        mockFrom.mockReturnValueOnce({
            delete: jest.fn(() => ({
                eq: jest.fn().mockResolvedValueOnce({
                    error: { message: 'No se pudo eliminar el registro' },
                }),
            })),
        });

        const response = await request(app)
            .delete('/api/reasignaciones/9999');

        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('error');
    });
});