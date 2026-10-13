import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import Registro from '../Registro';

global.fetch = vi.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve([]),
  })
);

describe('Vista Registro', () => {
  it('renderiza el formulario de creación de cuenta', () => {
    render(
      <MemoryRouter>
        <Registro />
      </MemoryRouter>
    );

    expect(screen.getByText('Registro de Usuario')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /CREAR CUENTA/i })).toBeInTheDocument();
  });
});