import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import Carrito from '../Carrito';

beforeEach(() => {
  localStorage.setItem('megagames_user', JSON.stringify({ id: 2, email: 'gamer@megagames.cl' }));
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve([]),
    })
  );
});

describe('Vista Carrito', () => {
  it('renderiza el título de la pasarela del carrito', async () => {
    render(
      <MemoryRouter>
        <Carrito />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Carrito de compra/i)).toBeInTheDocument();
    });
  });
});