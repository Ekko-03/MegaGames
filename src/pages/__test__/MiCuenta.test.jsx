import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import MiCuenta from '../MiCuenta';

beforeEach(() => {
  localStorage.setItem(
    'megagames_user',
    JSON.stringify({
      id: 2,
      nombre_completo: 'Gamer Demo',
      email: 'gamer@megagames.cl',
      rol: 'cliente',
    })
  );

  global.fetch = vi.fn((url) => {
    if (url.includes('/api/usuario/perfil/')) {
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            id: 2,
            nombre_completo: 'Gamer Demo',
            email: 'gamer@megagames.cl',
            telefono: '+56912345678',
            region_id: 1,
            comuna_id: 1,
          }),
      });
    }
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve([]),
    });
  });
});

describe('Vista MiCuenta', () => {
  it('renderiza el panel personal del usuario con sus secciones', async () => {
    render(
      <MemoryRouter>
        <MiCuenta />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Mi Cuenta')).toBeInTheDocument();
      expect(screen.getByText(/Bienvenido, Gamer Demo/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Mis Compras/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Mis Datos/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Lista de Deseos/i })).toBeInTheDocument();
    });
  });
});
