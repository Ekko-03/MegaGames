import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import Admin from '../Admin';

beforeEach(() => {
  localStorage.setItem(
    'megagames_user',
    JSON.stringify({ id: 1, email: 'admin@megagames.cl', rol: 'admin' })
  );

  global.fetch = vi.fn((url) => {
    if (url.includes('/api/admin/metricas')) {
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            resumen: {
              totalVendidos: 5,
              ingresosTotales: 150000,
              totalEnCarritos: 2,
              usuariosTotales: 3,
            },
            juegosMasVendidos: [],
            ultimasVentas: [],
          }),
      });
    }
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve([]),
    });
  });
});

describe('Vista Admin', () => {
  it('renderiza el panel de control y métricas para el administrador', async () => {
    render(
      <MemoryRouter>
        <Admin />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByText('Panel de Control de Administrador')
      ).toBeInTheDocument();
      expect(screen.getByText(/Productos Vendidos/i)).toBeInTheDocument();
    });
  });
});
