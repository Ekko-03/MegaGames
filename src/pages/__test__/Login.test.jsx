import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from '../Login';

describe('Vista Login', () => {
  it('renderiza los campos de entrada y botón de autenticación', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument();
    expect(screen.getByText('CORREO ELECTRÓNICO')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /ENTRAR/i })).toBeInTheDocument();
  });
});