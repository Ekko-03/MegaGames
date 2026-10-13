import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import Catalogo from '../Catalogo';

beforeEach(() => {
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve([
          {
            id: 1,
            titulo: 'Zelda Tears of the Kingdom',
            descripcion: 'Aventura épica en Hyrule',
            precio: 54990,
            imagen: '/img/zelda.jpg',
            plataforma: 'nintendo',
            es_preventa: 0,
            stock: 15,
          },
        ]),
    })
  );
});

describe('Vista Catalogo', () => {
  it('renderiza el título del catálogo y el buscador', async () => {
    render(
      <MemoryRouter>
        <Catalogo />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Catálogo de Videojuegos')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Buscar juego...')).toBeInTheDocument();
      expect(screen.getByText('Zelda Tears of the Kingdom')).toBeInTheDocument();
    });
  });
});
