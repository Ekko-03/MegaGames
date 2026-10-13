import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Blog from '../Blog';

describe('Vista Blog', () => {
  it('renderiza el encabezado del blog y la sección de noticias', () => {
    render(
      <MemoryRouter>
        <Blog />
      </MemoryRouter>
    );

    expect(screen.getByText('MegaGames News')).toBeInTheDocument();
    expect(screen.getByText('Tu diario gamer de confianza')).toBeInTheDocument();
    expect(screen.getByText('Últimas Noticias')).toBeInTheDocument();
  });
});
