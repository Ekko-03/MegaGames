import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Contacto from '../Contacto';

describe('Vista Contacto', () => {
  it('renderiza el formulario para enviar mensajes de soporte', () => {
    render(
      <MemoryRouter>
        <Contacto />
      </MemoryRouter>
    );

    expect(screen.getByText('Envíanos un mensaje')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Tu nombre')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /ENVIAR MENSAJE/i })).toBeInTheDocument();
  });
});