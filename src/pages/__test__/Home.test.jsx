import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from '../Home';

describe('Vista Home', () => {
  it('renderiza el título principal de novedades y plataformas', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(screen.getByText('Novedades')).toBeInTheDocument();
    expect(screen.getByText('Descubre nuestras plataformas')).toBeInTheDocument();
  });
});