import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Reports from './Reports.jsx'

describe('reportes administrativos', () => {
  it('aclara que la autenticación y los roles son simulados en el frontend', () => {
    render(<Reports />)

    expect(
      screen.getByText(/Este proyecto es solo frontend/),
    ).toBeTruthy()
  })

  it('aclara que los datos mock se reinician al recargar', () => {
    render(<Reports />)
    fireEvent.click(screen.getByRole('tab', { name: 'Disponibilidad' }))

    expect(screen.getByText('Datos de demostración')).toBeTruthy()
    expect(screen.getByText(/se reinician al recargar/)).toBeTruthy()
  })

  it('no presenta como reales métricas que todavía no se midieron', () => {
    render(<Reports />)
    fireEvent.click(screen.getByRole('tab', { name: 'Rendimiento' }))

    expect(screen.getByText('Rendimiento aún no medido')).toBeTruthy()
    expect(screen.getAllByText(/Pendiente de/).length).toBeGreaterThan(0)
    expect(screen.queryByText('1.8 s')).toBeNull()
  })
})
