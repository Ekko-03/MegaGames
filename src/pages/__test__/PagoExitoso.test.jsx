import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PagoExitoso from '../PagoExitoso';

describe('Vista PagoExitoso', () => {
  it('renderiza la confirmación de compra y datos de entrega cuando hay datos de orden', () => {
    const mockState = {
      cliente: {
        nombre: 'Carlos',
        apellidos: 'González',
        correo: 'carlos@test.cl',
        calle: 'Av. Libertador 456',
        departamento: '10A',
        region: 13,
        comuna: 50,
        indicaciones: 'Dejar en conserjería',
      },
      productos: [
        { id: 1, titulo: 'Super Mario Wonder', cantidad: 1, precio: 49990 },
      ],
      totalPagar: 49990,
    };

    render(
      <MemoryRouter initialEntries={[{ pathname: '/pago-exitoso', state: mockState }]}>
        <PagoExitoso />
      </MemoryRouter>
    );

    expect(screen.getByText('¡Se ha realizado la compra!')).toBeInTheDocument();
    expect(screen.getByText(/Dirección de entrega asignada/i)).toBeInTheDocument();
    expect(screen.getByText(/Carlos González/i)).toBeInTheDocument();
  });

  it('muestra aviso si se accede sin datos de compra previa', () => {
    render(
      <MemoryRouter initialEntries={['/pago-exitoso']}>
        <PagoExitoso />
      </MemoryRouter>
    );

    expect(screen.getByText('No hay ninguna compra reciente')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Volver al Inicio/i })).toBeInTheDocument();
  });
});
