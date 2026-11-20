import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import PerfumeBottle3D from './PerfumeBottle3D.jsx'

const renderer = vi.hoisted(() => ({ render: vi.fn(), dispose: vi.fn() }))

vi.mock('./perfumeBottle3DRuntime.js', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    WebGLRenderer: class {
      constructor() {
        this.domElement = document.createElement('canvas')
      }

      setPixelRatio() {}
      setClearColor() {}
      setSize() {}
      render = renderer.render
      dispose = renderer.dispose
    },
    PMREMGenerator: class {
      fromScene() {
        return { texture: null, dispose: vi.fn() }
      }

      dispose() {}
    },
  }
})

describe('PerfumeBottle3D', () => {
  function prepareScene(reducedMotion) {
    vi.stubGlobal('WebGLRenderingContext', function WebGLRenderingContext() {})
    vi.stubGlobal('matchMedia', () => ({ matches: reducedMotion }))
    vi.spyOn(window, 'getComputedStyle').mockReturnValue({
      getPropertyValue: () => '#ffffff',
    })
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
      fillText: vi.fn(),
    })
  }

  afterEach(() => {
    vi.clearAllMocks()
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('construye y renderiza el frasco 3D cuando WebGL está disponible', async () => {
    prepareScene(true)

    const { container, unmount } = render(<PerfumeBottle3D />)

    await waitFor(() => expect(renderer.render).toHaveBeenCalled())
    expect(container.querySelector('.bottle3d-canvas')).toBeTruthy()
    expect(screen.queryByRole('status')).toBeNull()
    const bottleControl = screen.getByRole('img', { name: /Frasco azul de perfume/ })
    const scene = renderer.render.mock.calls.at(-1)[0]
    const bottle = scene.children.find((object) => object.type === 'Group')
    const rotation = bottle.rotation.y
    fireEvent.keyDown(bottleControl, { key: 'ArrowRight' })
    expect(bottle.rotation.y).toBeCloseTo(rotation + 0.2)

    unmount()
    expect(renderer.dispose).toHaveBeenCalled()
  })

  it('levanta la tapa y libera neblina durante la animación', async () => {
    prepareScene(false)
    let now = 0
    let nextFrame
    vi.spyOn(performance, 'now').mockImplementation(() => now)
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
      nextFrame = callback
      return 1
    })
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {})

    render(<PerfumeBottle3D />)
    await waitFor(() => expect(renderer.render).toHaveBeenCalled())

    act(() => {
      for (let frame = 0; frame < 60; frame += 1) {
        now += 50
        nextFrame(now)
      }
    })

    const scene = renderer.render.mock.calls.at(-1)[0]
    const bottle = scene.children.find((object) => object.type === 'Group')
    const mist = scene.children.find((object) => object.type === 'Points')
    expect(mist.geometry.attributes.opacity.array.some((value) => value > 0)).toBe(true)
    const cap = bottle.children.find((object) => object.geometry?.type === 'CylinderGeometry'
      && object.children.length > 0)
    expect(cap.position.x).toBeGreaterThan(1)

    const positions = mist.geometry.attributes.position.array
    const opacity = mist.geometry.attributes.opacity.array
    const activeIndex = opacity.findIndex((value) => value > 0)
    const offset = activeIndex * 3
    const previousX = positions[offset]
    const previousZ = positions[offset + 2]

    fireEvent.keyDown(screen.getByRole('img', { name: /Frasco azul de perfume/ }), { key: 'ArrowRight' })
    act(() => {
      now += 50
      nextFrame(now)
    })

    expect(positions[offset + 2] - previousZ).toBeGreaterThan(0.08)
    expect(Math.abs(positions[offset] - previousX)).toBeLessThan(0.02)
  })
})
