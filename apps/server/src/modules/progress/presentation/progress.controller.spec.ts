import { ProgressController } from './progress.controller';
import type { RequestConUsuario } from '../../auth/presentation/jwt-auth.guard';

describe('ProgressController', () => {
  const calcularProgresoUseCase = { ejecutar: jest.fn() };
  let controlador: ProgressController;

  beforeEach(() => {
    jest.clearAllMocks();
    controlador = new ProgressController(calcularProgresoUseCase as never);
  });

  it('obtenerProgreso delega con el idCarrera y el id del usuario autenticado', () => {
    calcularProgresoUseCase.ejecutar.mockReturnValue('progreso');

    const solicitud = { user: { id: 3 } } as RequestConUsuario;
    const resultado = controlador.obtenerProgreso('icc', solicitud);

    expect(resultado).toBe('progreso');
    expect(calcularProgresoUseCase.ejecutar).toHaveBeenCalledWith('icc', 3);
  });
});
