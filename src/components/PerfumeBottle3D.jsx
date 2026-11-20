import { useEffect, useRef, useState } from 'react'

function getPerfumeColors() {
  const styles = getComputedStyle(document.documentElement)
  return {
    glassLight: styles.getPropertyValue('--color-perfume-glass-light').trim(),
    glassShadow: styles.getPropertyValue('--color-perfume-glass-shadow').trim(),
    keyLight: styles.getPropertyValue('--color-perfume-key-light').trim(),
    fillLight: styles.getPropertyValue('--color-perfume-fill-light').trim(),
    backLight: styles.getPropertyValue('--color-perfume-back-light').trim(),
    bubble: styles.getPropertyValue('--color-perfume-bubble').trim(),
    meniscus: styles.getPropertyValue('--color-perfume-meniscus').trim(),
    neutralWhite: styles.getPropertyValue('--color-perfume-neutral-white').trim(),
    blueGlass: styles.getPropertyValue('--color-perfume-blue-glass').trim(),
    blueBase: styles.getPropertyValue('--color-perfume-blue-base').trim(),
    noirLiquid: styles.getPropertyValue('--color-perfume-noir-liquid').trim(),
    noirEmissive: styles.getPropertyValue('--color-perfume-noir-emissive').trim(),
    noirMetal: styles.getPropertyValue('--color-perfume-noir-metal').trim(),
    capTop: styles.getPropertyValue('--color-perfume-noir-cap-top').trim(),
    silver: styles.getPropertyValue('--color-perfume-silver').trim(),
  }
}

function createLabelTexture(THREE, colors) {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 512
  const ctx = canvas.getContext('2d')

  ctx.fillStyle = colors.neutralWhite
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = '700 190px Georgia, serif'
  ctx.letterSpacing = '1px'
  ctx.fillText('NÉCTAR', 512, 240)

  ctx.font = '500 46px Georgia, serif'
  ctx.letterSpacing = '14px'
  ctx.fillText('NOIR ESSENCE', 512, 350)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

function createBottle(THREE, colors) {
  const group = new THREE.Group()
  const bodyShape = new THREE.Shape()
  bodyShape.moveTo(-0.9, -1.8)
  bodyShape.lineTo(0.9, -1.8)
  bodyShape.lineTo(0.9, 0.6)
  bodyShape.lineTo(-0.9, 0.6)
  bodyShape.closePath()
  const bodyGeometry = new THREE.ExtrudeGeometry(bodyShape, {
    depth: 1.02,
    bevelEnabled: true,
    bevelSegments: 1,
    steps: 1,
    bevelSize: 0.1,
    bevelThickness: 0.1,
  })
  bodyGeometry.translate(0, 0, -0.51)

  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: colors.blueGlass,
    metalness: 0,
    roughness: 0.08,
    transmission: 0.12,
    thickness: 0.55,
    ior: 1.46,
    clearcoat: 1,
    clearcoatRoughness: 0.06,
    transparent: true,
    opacity: 0.4,
    depthWrite: false,
    side: THREE.DoubleSide,
    envMapIntensity: 1.3,
    flatShading: true,
  })
  const glass = new THREE.Mesh(bodyGeometry, glassMaterial)
  glass.renderOrder = 4
  group.add(glass)

  const baseMaterial = glassMaterial.clone()
  baseMaterial.color.set(colors.blueBase)
  baseMaterial.opacity = 0.8
  const base = new THREE.Mesh(new THREE.BoxGeometry(1.98, 0.38, 1.2), baseMaterial)
  base.position.y = -1.68
  base.renderOrder = 4
  group.add(base)

  const labelTexture = createLabelTexture(THREE, colors)
  const labelMaterial = new THREE.MeshBasicMaterial({
    map: labelTexture,
    transparent: true,
    depthWrite: false,
    toneMapped: false,
  })
  const label = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 0.9), labelMaterial)
  label.position.set(0, -0.4, 0.62)
  label.renderOrder = 5
  group.add(label)

  const liquidMaterial = new THREE.MeshLambertMaterial({
    color: colors.noirLiquid,
    emissive: colors.noirEmissive,
    emissiveIntensity: 0.45,
    transparent: true,
    opacity: 1,
    depthWrite: false,
    side: THREE.DoubleSide,
  })
  const liquidShape = new THREE.Shape()
  liquidShape.moveTo(-0.805, -1.73)
  liquidShape.lineTo(0.805, -1.73)
  liquidShape.lineTo(0.805, 0.13)
  liquidShape.lineTo(-0.805, 0.13)
  liquidShape.closePath()
  const liquidGeometry = new THREE.ExtrudeGeometry(liquidShape, {
    depth: 0.79,
    bevelEnabled: true,
    bevelSegments: 1,
    bevelSize: 0.08,
    bevelThickness: 0.08,
    steps: 1,
  })
  liquidGeometry.translate(0, 0, -0.395)
  const liquid = new THREE.Mesh(liquidGeometry, liquidMaterial)
  liquid.renderOrder = 1
  const liquidBaseY = 0
  const liquidBottom = -1.8
  const liquidTop = 0.2
  group.add(liquid)

  const bubbleCount = 40
  const bubbleData = []

  for (let index = 0; index < bubbleCount; index += 1) {
    const radius = THREE.MathUtils.randFloat(0.025, 0.08)
    bubbleData.push({
      radius,
      baseX: THREE.MathUtils.randFloat(-0.75, 0.75),
      baseZ: THREE.MathUtils.randFloat(-0.3, 0.3),
      y: THREE.MathUtils.randFloat(liquidBottom + radius + 0.06, liquidTop - radius),
      speed: THREE.MathUtils.randFloat(0.16, 0.32) + radius * 2.4,
      sway: THREE.MathUtils.randFloat(0.012, 0.05),
      swaySpeed: THREE.MathUtils.randFloat(0.6, 1.9),
      phase: THREE.MathUtils.randFloat(0, Math.PI * 2),
    })
  }

  const bubbleMaterial = new THREE.MeshPhysicalMaterial({
    color: colors.bubble,
    metalness: 0,
    roughness: 0.02,
    transmission: 0.9,
    thickness: 0.15,
    ior: 1.33,
    clearcoat: 1,
    clearcoatRoughness: 0.02,
    iridescence: 0.6,
    iridescenceIOR: 1.3,
    iridescenceThicknessMinimum: 100,
    iridescenceThicknessMaximum: 480,
    transparent: true,
    opacity: 0.38,
    side: THREE.DoubleSide,
    depthWrite: false,
    envMapIntensity: 2.2,
  })
  const bubbles = new THREE.InstancedMesh(
    new THREE.SphereGeometry(1, 16, 12),
    bubbleMaterial,
    bubbleCount,
  )
  bubbles.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
  bubbles.frustumCulled = false
  bubbles.renderOrder = 3
  group.add(bubbles)

  const meniscusMaterial = new THREE.MeshBasicMaterial({
    color: colors.meniscus,
    transparent: true,
    opacity: 0.45,
    side: THREE.DoubleSide,
    toneMapped: false,
  })
  const meniscus = new THREE.Mesh(
    new THREE.BoxGeometry(1.6, 0.016, 0.78),
    meniscusMaterial,
  )
  meniscus.position.y = liquidTop - 0.03
  meniscus.renderOrder = 2
  liquid.add(meniscus)

  const tubeMaterial = new THREE.MeshPhysicalMaterial({
    color: colors.neutralWhite,
    metalness: 0,
    roughness: 0.08,
    transmission: 0.3,
    thickness: 0.04,
    ior: 1.33,
    transparent: true,
    opacity: 0.34,
    depthWrite: false,
    side: THREE.DoubleSide,
    envMapIntensity: 1.2,
  })
  const tubeHeight = 2.4
  const tube = new THREE.Mesh(
    new THREE.CylinderGeometry(0.026, 0.03, tubeHeight, 12, 1, true),
    tubeMaterial,
  )
  tube.position.set(0.06, -0.4, 0.06)
  tube.renderOrder = 2
  group.add(tube)

  const collarMaterial = new THREE.MeshStandardMaterial({
    color: colors.noirMetal,
    metalness: 1,
    roughness: 0.25,
    side: THREE.DoubleSide,
  })
  const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.3, 32), collarMaterial)
  collar.position.y = 0.85
  group.add(collar)

  const silverMaterial = new THREE.MeshStandardMaterial({
    color: colors.silver,
    metalness: 1,
    roughness: 0.2,
  })
  const nozzle = new THREE.Group()
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 0.4, 24), silverMaterial)
  stem.position.y = 0.2
  nozzle.add(stem)
  const nozzleHead = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.1, 24), silverMaterial.clone())
  nozzleHead.position.y = 0.45
  nozzle.add(nozzleHead)
  nozzle.position.y = 1
  group.add(nozzle)

  const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 1, 48), collarMaterial.clone())
  const capTop = new THREE.Mesh(
    new THREE.CylinderGeometry(0.5, 0.5, 0.02, 48),
    new THREE.MeshStandardMaterial({ color: colors.capTop, metalness: 1, roughness: 0.15 }),
  )
  capTop.position.y = 0.5
  cap.add(capTop)
  cap.position.y = 1.2
  group.add(cap)

  return {
    group,
    liquid,
    bubbles,
    bubbleData,
    meniscus,
    liquidBaseY,
    liquidBottom,
    liquidTop,
    labelTexture,
    cap,
    nozzle,
  }
}

function createMist(THREE, colors) {
  const count = 180
  const positions = new Float32Array(count * 3)
  const opacity = new Float32Array(count)
  const particles = Array.from({ length: count }, () => ({
    age: 0,
    life: 0,
    vx: 0,
    vy: 0,
    vz: 0,
  }))
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('opacity', new THREE.BufferAttribute(opacity, 1))
  const material = new THREE.ShaderMaterial({
    uniforms: { mistColor: { value: new THREE.Color(colors.neutralWhite) } },
    transparent: true,
    depthWrite: false,
    vertexShader: `
      attribute float opacity;
      varying float particleOpacity;
      void main() {
        particleOpacity = opacity;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = 180.0 / -mvPosition.z;
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform vec3 mistColor;
      varying float particleOpacity;
      void main() {
        float distanceFromCenter = length(gl_PointCoord - vec2(0.5));
        float alpha = (1.0 - smoothstep(0.05, 0.5, distanceFromCenter)) * particleOpacity;
        gl_FragColor = vec4(mistColor, alpha);
      }
    `,
  })
  const points = new THREE.Points(geometry, material)
  points.frustumCulled = false
  return { points, positions, opacity, particles }
}

function PerfumeBottle3D() {
  const containerRef = useRef(null)
  const [failed, setFailed] = useState(false)
  const webglSupported =
    typeof window !== 'undefined' && typeof window.WebGLRenderingContext !== 'undefined'

  useEffect(() => {
    const container = containerRef.current
    if (!container || !webglSupported) return undefined

    let cancelled = false
    let cleanup = () => {}

    async function init() {
      try {
        const THREE = await import('./perfumeBottle3DRuntime.js')
        if (cancelled) return

        const { RoomEnvironment } = THREE
        const colors = getPerfumeColors()

        const renderer = new THREE.WebGLRenderer({
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        })
        cleanup = () => {
          renderer.dispose()
          renderer.domElement.remove()
        }

        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
        renderer.setClearColor(colors.neutralWhite, 0)
        renderer.outputColorSpace = THREE.SRGBColorSpace
        renderer.toneMapping = THREE.ACESFilmicToneMapping
        renderer.toneMappingExposure = 0.78
        renderer.domElement.className = 'bottle3d-canvas'
        container.appendChild(renderer.domElement)

        const scene = new THREE.Scene()

        const pmrem = new THREE.PMREMGenerator(renderer)
        const environment = pmrem.fromScene(new RoomEnvironment(), 0.04)
        scene.environment = environment.texture
        scene.environmentIntensity = 0.25

        const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100)
        camera.position.set(0, 1.4, 12)
        camera.lookAt(0, 0.55, 0)

        scene.add(new THREE.HemisphereLight(colors.glassLight, colors.glassShadow, 0.3))

        const keyLight = new THREE.DirectionalLight(colors.keyLight, 0.8)
        keyLight.position.set(5, 8, 7)
        scene.add(keyLight)

        const fillLight = new THREE.DirectionalLight(colors.fillLight, 0.3)
        fillLight.position.set(-6, 3, 4)
        scene.add(fillLight)

        const warmBackLight = new THREE.PointLight(colors.backLight, 12, 40, 2)
        warmBackLight.position.set(0, 2.2, -4.5)
        scene.add(warmBackLight)

        const bottleParts = createBottle(THREE, colors)
        const {
          group: bottle,
          liquid,
          bubbles,
          bubbleData,
          meniscus,
          liquidBaseY,
          liquidBottom,
          liquidTop,
          labelTexture,
          cap,
          nozzle,
        } = bottleParts
        scene.add(bottle)
        const mist = createMist(THREE, colors)
        scene.add(mist.points)
        const mistOrigin = new THREE.Vector3()
        const mistDirection = new THREE.Vector3()

        const bubbleDummy = new THREE.Object3D()

        function resetBubble(bubble) {
          bubble.baseX = THREE.MathUtils.randFloat(-0.75, 0.75)
          bubble.baseZ = THREE.MathUtils.randFloat(-0.3, 0.3)
          bubble.y = liquidBottom + bubble.radius + 0.05
          bubble.speed = THREE.MathUtils.randFloat(0.16, 0.32) + bubble.radius * 2.4
          bubble.sway = THREE.MathUtils.randFloat(0.012, 0.05)
          bubble.swaySpeed = THREE.MathUtils.randFloat(0.6, 1.9)
          bubble.phase = THREE.MathUtils.randFloat(0, Math.PI * 2)
        }

        function updateBubbles(time, delta) {
          for (let index = 0; index < bubbleData.length; index += 1) {
            const bubble = bubbleData[index]
            bubble.y += bubble.speed * delta
            if (bubble.y > liquidTop - bubble.radius) {
              resetBubble(bubble)
            }
            const x = bubble.baseX + Math.sin(time * bubble.swaySpeed + bubble.phase) * bubble.sway
            const z =
              bubble.baseZ + Math.cos(time * bubble.swaySpeed * 0.8 + bubble.phase) * bubble.sway * 0.7
            bubbleDummy.position.set(x, bubble.y, z)
            bubbleDummy.scale.setScalar(bubble.radius)
            bubbleDummy.updateMatrix()
            bubbles.setMatrixAt(index, bubbleDummy.matrix)
          }
          bubbles.instanceMatrix.needsUpdate = true
        }

        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        let elapsed = 0
        let lastTime = performance.now()
        let frameId = 0
        let rotationY = 0.2
        let rotationX = 0
        let drag = null
        let emitAccumulator = 0

        function updateMist(delta, spraying) {
          nozzle.updateWorldMatrix(true, false)
          mistOrigin.set(0, 0.45, 0).applyMatrix4(nozzle.matrixWorld)
          mistDirection.copy(camera.position).sub(mistOrigin).normalize()
          if (spraying) emitAccumulator += delta * 120
          let emitCount = Math.floor(emitAccumulator)
          emitAccumulator -= emitCount
          mist.particles.forEach((particle, index) => {
            const offset = index * 3
            if (particle.age >= particle.life && emitCount > 0) {
              particle.age = 0
              particle.life = THREE.MathUtils.randFloat(0.8, 1.5)
              const speed = THREE.MathUtils.randFloat(1.8, 3.5)
              particle.vx = mistDirection.x * speed + THREE.MathUtils.randFloat(-0.3, 0.3)
              particle.vy = mistDirection.y * speed + THREE.MathUtils.randFloat(-0.3, 0.3)
              particle.vz = mistDirection.z * speed
              mist.positions[offset] = mistOrigin.x + mistDirection.x * 0.15
              mist.positions[offset + 1] = mistOrigin.y + mistDirection.y * 0.15
              mist.positions[offset + 2] = mistOrigin.z + mistDirection.z * 0.15
              emitCount -= 1
            }
            if (particle.age < particle.life) {
              particle.age += delta
              mist.positions[offset] += particle.vx * delta
              mist.positions[offset + 1] += particle.vy * delta
              mist.positions[offset + 2] += particle.vz * delta
              particle.vy -= 0.2 * delta
              mist.opacity[index] = Math.max(0, 1 - particle.age / particle.life) * 0.55
            } else {
              mist.opacity[index] = 0
            }
          })
          mist.points.geometry.attributes.position.needsUpdate = true
          mist.points.geometry.attributes.opacity.needsUpdate = true
        }

        updateBubbles(0, 0)

        function renderFrame() {
          const now = performance.now()
          const delta = reduceMotion ? 0 : Math.min((now - lastTime) / 1000, 0.05)
          lastTime = now
          if (reduceMotion) {
            bottle.rotation.y = rotationY
            bottle.rotation.x = rotationX
            bottle.position.y = 0
            cap.position.set(0, 1.2, 0)
            cap.rotation.z = 0
            nozzle.position.y = 1
            liquid.rotation.z = 0
            liquid.rotation.x = 0
            liquid.position.y = liquidBaseY
            meniscus.position.y = liquidTop - 0.03
            meniscus.rotation.z = 0
          } else {
            elapsed += delta
            const phase = elapsed % 11
            if (!drag) {
              if (phase > 0.2 && phase < 7.4) {
                const target = Math.round(rotationY / (Math.PI * 2)) * Math.PI * 2 + 0.2
                rotationY += (target - rotationY) * Math.min(1, 2.5 * delta)
              } else {
                rotationY += delta * 0.15
              }
            }
            bottle.rotation.y = rotationY
            bottle.rotation.x = rotationX
            bottle.position.y = Math.sin(elapsed * 0.9) * 0.06
            const ease = (value) => {
              const t = THREE.MathUtils.clamp(value, 0, 1)
              return t * t * (3 - 2 * t)
            }
            const lift = ease((phase - 0.4) / 1.2) - ease((phase - 6.2) / 1.2)
            const press = ease((phase - 2) / 0.25) - ease((phase - 3.6) / 0.3)
            cap.position.set(lift * 1.5, 1.2 + lift * 0.6, 0)
            cap.rotation.z = -lift * 0.35
            nozzle.position.y = 1 - 0.14 * press
            updateMist(delta, phase > 2.1 && phase < 3.7)
            liquid.rotation.z = Math.sin(elapsed * 0.9) * 0.03
            liquid.rotation.x = Math.cos(elapsed * 0.7) * 0.02
            liquid.position.y = liquidBaseY + Math.sin(elapsed * 1.1) * 0.03
            meniscus.position.y =
              liquidTop - 0.03 + Math.sin(elapsed * 1.6) * 0.012
            meniscus.rotation.z = Math.sin(elapsed * 1.2) * 0.012
            updateBubbles(elapsed, delta)
          }
          renderer.render(scene, camera)
        }

        function loop() {
          renderFrame()
          frameId = window.requestAnimationFrame(loop)
        }

        function resize() {
          const width = container.clientWidth || 320
          const height = container.clientHeight || 320
          renderer.setSize(width, height, false)
          camera.aspect = width / height
          camera.updateProjectionMatrix()
          renderFrame()
        }

        function onPointerDown(event) {
          drag = { x: event.clientX, y: event.clientY, id: event.pointerId }
          container.setPointerCapture(event.pointerId)
        }

        function onPointerMove(event) {
          if (!drag || drag.id !== event.pointerId) return
          rotationY += (event.clientX - drag.x) * 0.01
          rotationX = THREE.MathUtils.clamp(rotationX + (event.clientY - drag.y) * 0.005, -0.2, 0.5)
          drag.x = event.clientX
          drag.y = event.clientY
          if (reduceMotion) renderFrame()
        }

        function onPointerEnd(event) {
          if (drag && drag.id === event.pointerId) drag = null
        }

        function onKeyDown(event) {
          if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
          event.preventDefault()
          rotationY += event.key === 'ArrowLeft' ? -0.2 : 0.2
          if (reduceMotion) renderFrame()
        }

        container.addEventListener('pointerdown', onPointerDown)
        container.addEventListener('pointermove', onPointerMove)
        container.addEventListener('pointerup', onPointerEnd)
        container.addEventListener('pointercancel', onPointerEnd)
        container.addEventListener('lostpointercapture', onPointerEnd)
        container.addEventListener('keydown', onKeyDown)

        resize()

        let observer
        if (typeof ResizeObserver !== 'undefined') {
          observer = new ResizeObserver(resize)
          observer.observe(container)
        } else {
          window.addEventListener('resize', resize)
        }

        if (reduceMotion) {
          renderFrame()
        } else {
          loop()
        }

        cleanup = () => {
          window.cancelAnimationFrame(frameId)
          container.removeEventListener('pointerdown', onPointerDown)
          container.removeEventListener('pointermove', onPointerMove)
          container.removeEventListener('pointerup', onPointerEnd)
          container.removeEventListener('pointercancel', onPointerEnd)
          container.removeEventListener('lostpointercapture', onPointerEnd)
          container.removeEventListener('keydown', onKeyDown)
          if (observer) {
            observer.disconnect()
          } else {
            window.removeEventListener('resize', resize)
          }
          scene.traverse((object) => {
            if (!object.isMesh) return
            object.geometry.dispose()
            if (Array.isArray(object.material)) {
              object.material.forEach((material) => material.dispose())
            } else {
              object.material.dispose()
            }
          })
          labelTexture.dispose()
          mist.points.geometry.dispose()
          mist.points.material.dispose()
          environment.dispose()
          pmrem.dispose()
          renderer.dispose()
          renderer.domElement.remove()
        }
      } catch (error) {
        cleanup()
        cleanup = () => {}
        console.error('No se pudo iniciar el frasco 3D:', error)
        if (!cancelled) setFailed(true)
      }
    }

    init()

    return () => {
      cancelled = true
      cleanup()
    }
  }, [webglSupported])

  return (
    <div className="bottle3d-scene">
      {failed || !webglSupported ? (
        <p role="status" className="bottle3d-fallback">
          {failed
            ? 'No se pudo cargar el frasco 3D. Actualiza la página e inténtalo de nuevo.'
            : 'La escena animada no está disponible en este navegador.'}
        </p>
      ) : (
        <div
          ref={containerRef}
          className="bottle3d-canvas-container"
          role="img"
          tabIndex={0}
          aria-label="Frasco azul de perfume Néctar Noir Essence en 3D. Arrastra o usa las flechas izquierda y derecha para girarlo."
        />
      )}
    </div>
  )
}

export default PerfumeBottle3D
