import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import Catalog from './Catalog.jsx'
import { getProducts } from '../auth/mockApi.js'

vi.mock('../auth/mockApi.js', () => ({
  getProducts: vi.fn(),
}))

describe('Catálogo', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('muestra un error de carga sin informar que no hay productos', async () => {
    getProducts.mockRejectedValue(new Error('Error interno'))

    render(
      <MemoryRouter>
        <Catalog />
      </MemoryRouter>,
    )

    expect(
      await screen.findByText(
        'Ocurrió un error inesperado. Inténtalo de nuevo más tarde.',
      ),
    ).toBeTruthy()
    expect(screen.queryByText('0 productos encontrados')).toBeNull()
  })
})
