import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Reports from './Reports.jsx'

describe('reportes administrativos', () => {
  it('aclara que la autenticación mock no protege datos reales', () => {
    render(<Reports />)

    expect(
      screen.getByText(/La autenticación de esta versión es simulada/),
    ).toBeTruthy()
  })

  it('no presenta como reales métricas que todavía no se midieron', () => {
    render(<Reports />)
    fireEvent.click(screen.getByRole('tab', { name: 'Rendimiento' }))

    expect(screen.getByText('Rendimiento aún no medido')).toBeTruthy()
    expect(screen.getAllByText(/Pendiente de/).length).toBeGreaterThan(0)
    expect(screen.queryByText('1.8 s')).toBeNull()
  })
})
