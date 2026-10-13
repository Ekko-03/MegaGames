import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Nosotros from '../Nosotros';

describe('Vista Nosotros', () => {
  it('renderiza la sección institucional de la tienda', () => {
    render(
      <MemoryRouter>
        <Nosotros />
      </MemoryRouter>
    );

    expect(screen.getByText('Sobre MegaGames')).toBeInTheDocument();
    expect(screen.getByText('Nuestra Historia')).toBeInTheDocument();
  });
});