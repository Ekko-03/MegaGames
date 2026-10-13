import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import Preventas from '../Preventas';

global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([]),
  })
);

describe('Vista Preventas', () => {
  it('renderiza el título de preventas exclusivas', async () => {
    render(
      <MemoryRouter>
        <Preventas />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Preventas Exclusivas')).toBeInTheDocument();
    });
  });
});