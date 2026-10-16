/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable prefer-const */
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

interface HeroSingle3DProps {
  className?: string
}

function checkWebGLSupport(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(
      window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')),
    )
  } catch {
    return false
  }
}

/**
 * Tạo khối hình học Ngôi Sao Kim Cương 4 Cánh Đa Diện (Faceted Diamond Astroid Star)
 * Dựa trên toán học đường cong Astroid Hypocycloid của logo EduMap:
 * - x(t) = a * sgn(cos t) * |cos t|^3
 * - y(t) = b * sgn(sin t) * |sin t|^3
 * - Kết hợp đỉnh nhô trước (Front Apex) và đỉnh nhô sau (Back Apex) tạo các diện cắt vát kim cương (facets)
 * - Mỗi diện tam giác phản chiếu ánh sáng độc lập, tạo hiệu ứng lấp lánh (sparkle glints) như đá quý cao cấp
 */
function createFacetedDiamondStarGeometry(): THREE.BufferGeometry {
  const positions: number[] = []

  const a = 1.28 // Độ rộng cánh ngang
  const b = 1.52 // Chiều dài cánh dọc (tỷ lệ chuẩn ngôi sao EduMap)
  const segmentsPerQuadrant = 8
  const totalSegments = segmentsPerQuadrant * 4

  const zApex = 0.44 // Đỉnh nhô cao ở tâm (Diamond Apex)
  const zRim = 0.07 // Độ dày đai viền ở chu vi (Girdle Belt)

  // 1. Tạo các điểm trên đường cong Astroid ở chu vi
  const rimPoints: { x: number; y: number }[] = []
  for (let i = 0; i < totalSegments; i++) {
    const t = (i / totalSegments) * Math.PI * 2
    const cosT = Math.cos(t)
    const sinT = Math.sin(t)
    const x = a * Math.sign(cosT) * Math.pow(Math.abs(cosT), 3)
    const y = b * Math.sign(sinT) * Math.pow(Math.abs(sinT), 3)
    rimPoints.push({ x, y })
  }

  // 2. Tạo các diện vát mặt trước, mặt sau và đai viền (Faceted Triangles)
  for (let i = 0; i < totalSegments; i++) {
    const next = (i + 1) % totalSegments
    const p1 = rimPoints[i]
    const p2 = rimPoints[next]

    // Tam giác mặt trước: Từ đỉnh trung tâm (0, 0, zApex) đến 2 điểm viền
    positions.push(0, 0, zApex, p1.x, p1.y, zRim, p2.x, p2.y, zRim)

    // Tam giác mặt sau: Từ đỉnh trung tâm đáy (0, 0, -zApex) đến 2 điểm viền đáy
    positions.push(0, 0, -zApex, p2.x, p2.y, -zRim, p1.x, p1.y, -zRim)

    // Đai viền chu vi dày dặn (2 tam giác tạo thành hình chữ nhật vát)
    positions.push(
      p1.x,
      p1.y,
      zRim,
      p1.x,
      p1.y,
      -zRim,
      p2.x,
      p2.y,
      zRim,

      p2.x,
      p2.y,
      zRim,
      p1.x,
      p1.y,
      -zRim,
      p2.x,
      p2.y,
      -zRim,
    )
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geo.computeVertexNormals()
  return geo
}

/**
 * HeroSingle3D - "The Living 3D Brand Sparkle" (Biểu tượng Logo 3D Pha Lê Kim Cương)
 *
 * Tinh chỉnh đồ họa theo yêu cầu:
 * 1. Ngôi sao 4 cánh: Dày dặn, vát cạnh kim cương đa diện (32 facets), phủ men bóng gương (Clearcoat Glass),
 *    màu tím Indigo hoàng gia phản chiếu ánh sáng studio lấp lánh 60fps.
 * 2. Lõi năng lượng lượng tử bên trong: Khối đa diện ngọc bích phát sáng nhịp nhàng qua thân pha lê.
 * 3. Vệ tinh dấu cộng (+) bên phải trên: Gia công khối 3D viền vát sáng ánh kim platinum.
 * 4. Vệ tinh chấm tròn (•) bên trái dưới: Ngọc bích phát quang cyan với vành đai ánh sáng bao bọc.
 * 5. Hai vành quỹ đạo thiên hà đan chéo: Mang hạt beacon lướt chậm rãi, tạo không gian chiều sâu đa tầng.
 * 6. Tương tác mượt mà: Nghiêng theo chuột người dùng (Mouse Parallax) và cuộn trang.
 */
export default function HeroSingle3D({ className = '' }: HeroSingle3DProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [hasWebGL, setHasWebGL] = useState<boolean>(true)

  useEffect(() => {
    if (!checkWebGLSupport()) {
      setHasWebGL(false)
      return
    }

    const container = containerRef.current
    if (!container) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(36, container.clientWidth / container.clientHeight, 0.1, 50)
    camera.position.set(0, 0, 6.4)

    let renderer: THREE.WebGLRenderer | null = null
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      })
      renderer.setSize(container.clientWidth, container.clientHeight)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.toneMapping = THREE.ACESFilmicToneMapping
      renderer.toneMappingExposure = 1.3
      container.appendChild(renderer.domElement)
    } catch {
      setHasWebGL(false)
      return
    }

    // 2. Hệ Thống Ánh Sáng Studio Kim Cương
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.3)
    scene.add(ambientLight)

    // Key Light chính: Tạo vệt lóa sáng (Specular glints) trên các mặt vát kim cương
    const keyLight = new THREE.DirectionalLight(0xffffff, 3.8)
    keyLight.position.set(4.5, 5.5, 5.0)
    scene.add(keyLight)

    // Rim Light tím Lavender: Đánh sáng viền cạnh phía sau
    const rimLight = new THREE.PointLight(0xa99dff, 5.0, 16)
    rimLight.position.set(-4.5, 3.5, 3.5)
    scene.add(rimLight)

    // Fill Light xanh Cyan: Tạo ánh quang ngọc bích từ góc dưới
    const fillLight = new THREE.PointLight(0x38bdf8, 3.2, 14)
    fillLight.position.set(3.5, -4.5, 3.0)
    scene.add(fillLight)

    const updateThemeLights = (isDark: boolean) => {
      if (isDark) {
        ambientLight.intensity = 1.1
        keyLight.intensity = 3.2
        rimLight.color.setHex(0xa99dff)
        rimLight.intensity = 4.8
        fillLight.color.setHex(0x38bdf8)
        fillLight.intensity = 2.8
      } else {
        ambientLight.intensity = 1.5
        keyLight.intensity = 4.0
        rimLight.color.setHex(0x818cf8)
        rimLight.intensity = 5.0
        fillLight.color.setHex(0x0284c7)
        fillLight.intensity = 3.2
      }
    }

    const isCurrentDark = document.documentElement.classList.contains('dark')
    updateThemeLights(isCurrentDark)

    const handleThemeChange = (e: Event) => {
      const customEvt = e as CustomEvent<{ theme: 'light' | 'dark' }>
      const isDark = customEvt.detail?.theme === 'dark' || document.documentElement.classList.contains('dark')
      updateThemeLights(isDark)
    }
    window.addEventListener('edumap-theme-changed', handleThemeChange)

    // 3. Nhóm chính chứa toàn bộ biểu tượng Logo 3D
    const mainGroup = new THREE.Group()
    scene.add(mainGroup)

    // =========================================================================
    // PHẦN 1: NGÔI SAO KIM CƯƠNG 4 CÁNH ĐA DIỆN (FACETED DIAMOND ASTROID STAR)
    // =========================================================================
    const starGeo = createFacetedDiamondStarGeometry()

    const starMat = new THREE.MeshPhysicalMaterial({
      color: 0x5843ec, // Sắc tím Indigo sang trọng chuẩn nhận diện thương hiệu
      emissive: 0x24145e, // Chiều sâu nội tại phát quang
      emissiveIntensity: 0.35,
      roughness: 0.08,
      metalness: 0.28,
      clearcoat: 1.0, // Lớp phủ bóng gương thủy tinh cao cấp
      clearcoatRoughness: 0.03,
      reflectivity: 0.95,
      transparent: true,
      opacity: 0.95,
      flatShading: true, // Bắt buộc flatShading để từng diện tam giác phản xạ ánh sáng như kim cương
    })
    const starMesh = new THREE.Mesh(starGeo, starMat)
    mainGroup.add(starMesh)

    // Viền cạnh lăng kính phát quang (Prism Edge Outlines)
    const starEdges = new THREE.EdgesGeometry(starGeo, 18)
    const starEdgeMat = new THREE.LineBasicMaterial({
      color: 0xd8b4fe, // Sắc Lavender sáng
      transparent: true,
      opacity: 0.7,
    })
    const starEdgeMesh = new THREE.LineSegments(starEdges, starEdgeMat)
    mainGroup.add(starEdgeMesh)

    // =========================================================================
    // PHẦN 2: LÕI NĂNG LƯỢNG LƯỢNG TỬ BÊN TRONG (INNER QUANTUM CRYSTAL CORE)
    // =========================================================================
    const innerCoreGeo = new THREE.OctahedronGeometry(0.38, 0)
    const innerCoreMat = new THREE.MeshPhysicalMaterial({
      color: 0x818cf8,
      emissive: 0x6366f1,
      emissiveIntensity: 1.1,
      roughness: 0.1,
      metalness: 0.1,
      clearcoat: 1.0,
      flatShading: true,
    })
    const innerCoreMesh = new THREE.Mesh(innerCoreGeo, innerCoreMat)
    mainGroup.add(innerCoreMesh)

    // =========================================================================
    // PHẦN 3: DẤU CỘNG VỆ TINH (+) GÓC TRÊN PHẢI (CHROME FACETED CROSS)
    // =========================================================================
    const plusGroup = new THREE.Group()
    plusGroup.position.set(1.28, 1.08, 0.26)
    mainGroup.add(plusGroup)

    const plusMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      emissive: 0x818cf8,
      emissiveIntensity: 0.2,
      roughness: 0.1,
      metalness: 0.6,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
    })

    const plusBarHGeo = new THREE.BoxGeometry(0.38, 0.1, 0.1)
    const plusBarH = new THREE.Mesh(plusBarHGeo, plusMat)
    plusGroup.add(plusBarH)

    const plusBarVGeo = new THREE.BoxGeometry(0.1, 0.38, 0.1)
    const plusBarV = new THREE.Mesh(plusBarVGeo, plusMat)
    plusGroup.add(plusBarV)

    // Hạt ngọc trung tâm dấu cộng
    const plusGemGeo = new THREE.OctahedronGeometry(0.08, 0)
    const plusGemMat = new THREE.MeshBasicMaterial({ color: 0xffffff })
    const plusGem = new THREE.Mesh(plusGemGeo, plusGemMat)
    plusGroup.add(plusGem)

    // =========================================================================
    // PHẦN 4: VỆ TINH VÒNG TRÒN (•) GÓC DƯỚI TRÁI (LUMINESCENT ORB & HALO)
    // =========================================================================
    const dotGroup = new THREE.Group()
    dotGroup.position.set(-1.22, -1.08, 0.24)
    mainGroup.add(dotGroup)

    // Vành halo nghiêng bao quanh
    const ringGeo = new THREE.TorusGeometry(0.25, 0.035, 16, 44)
    const ringMat = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8, // Sky Cyan
      emissive: 0x0284c7,
      emissiveIntensity: 0.4,
      roughness: 0.1,
      metalness: 0.3,
      clearcoat: 1.0,
    })
    const ringMesh = new THREE.Mesh(ringGeo, ringMat)
    ringMesh.rotation.x = Math.PI / 3.5
    dotGroup.add(ringMesh)

    // Hạt ngọc phát quang trung tâm
    const coreDotGeo = new THREE.SphereGeometry(0.1, 20, 20)
    const coreDotMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      emissive: 0x38bdf8,
      emissiveIntensity: 0.9,
      roughness: 0.05,
      metalness: 0.1,
      clearcoat: 1.0,
    })
    const coreDotMesh = new THREE.Mesh(coreDotGeo, coreDotMat)
    dotGroup.add(coreDotMesh)

    // =========================================================================
    // PHẦN 5: HAI VÀNH QUỸ ĐẠO THIÊN HÀ ĐAN CHÉO (DUAL CELESTIAL ORBITS)
    // =========================================================================
    // Vành 1: Tím Lavender
    const orbit1Group = new THREE.Group()
    orbit1Group.rotation.x = Math.PI / 3.4
    orbit1Group.rotation.y = Math.PI / 5.2
    mainGroup.add(orbit1Group)

    const orbit1Radius = 2.05
    const orbit1Geo = new THREE.TorusGeometry(orbit1Radius, 0.012, 16, 110)
    const orbit1Mat = new THREE.MeshBasicMaterial({
      color: 0xa5b4fc,
      transparent: true,
      opacity: 0.45,
    })
    const orbit1Mesh = new THREE.Mesh(orbit1Geo, orbit1Mat)
    orbit1Group.add(orbit1Mesh)

    const beacon1Geo = new THREE.SphereGeometry(0.045, 12, 12)
    const beacon1Mat = new THREE.MeshBasicMaterial({ color: 0xffffff })
    const beacon1Mesh = new THREE.Mesh(beacon1Geo, beacon1Mat)
    orbit1Group.add(beacon1Mesh)

    // Vành 2: Xanh Cyan
    const orbit2Group = new THREE.Group()
    orbit2Group.rotation.x = -Math.PI / 3.8
    orbit2Group.rotation.y = -Math.PI / 4.2
    mainGroup.add(orbit2Group)

    const orbit2Radius = 1.82
    const orbit2Geo = new THREE.TorusGeometry(orbit2Radius, 0.01, 16, 96)
    const orbit2Mat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.35,
    })
    const orbit2Mesh = new THREE.Mesh(orbit2Geo, orbit2Mat)
    orbit2Group.add(orbit2Mesh)

    const beacon2Geo = new THREE.SphereGeometry(0.038, 12, 12)
    const beacon2Mat = new THREE.MeshBasicMaterial({ color: 0x7dd3fc })
    const beacon2Mesh = new THREE.Mesh(beacon2Geo, beacon2Mat)
    orbit2Group.add(beacon2Mesh)

    // =========================================================================
    // TƯƠNG TÁC CHUỘT (MOUSE PARALLAX) & CUỘN TRANG (SCROLL)
    // =========================================================================
    let targetMouseX = 0
    let targetMouseY = 0
    let currentMouseX = 0
    let currentMouseY = 0

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window
      targetMouseX = ((e.clientX / innerWidth) * 2 - 1) * 0.22
      targetMouseY = (-(e.clientY / innerHeight) * 2 + 1) * 0.18
    }
    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    let targetScrollY = 0
    let currentScrollY = 0

    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset || 0
      targetScrollY = scrollY * 0.003
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    const handleResize = () => {
      if (!container || !renderer) return
      const width = container.clientWidth
      const height = container.clientHeight
      camera.aspect = width / (height || 1)
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }
    window.addEventListener('resize', handleResize)

    let isVisible = true
    const observer = new IntersectionObserver((entries) => {
      for (const e of entries) {
        isVisible = e.isIntersecting
      }
    })
    observer.observe(container)

    // =========================================================================
    // RENDER LOOP 60FPS
    // =========================================================================
    let animationFrameId: number
    let clock = new THREE.Clock()
    let beacon1Angle = 0
    let beacon2Angle = Math.PI

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)
      if (!isVisible || document.hidden || document.documentElement.classList.contains('video-modal-open')) return

      const delta = Math.min(clock.getDelta(), 0.1)
      const time = clock.getElapsedTime()
      const motion = prefersReducedMotion ? 0.08 : 1.0

      // 1. Ngôi sao 4 cánh kim cương xoay nhịp nhàng quanh trục Y và nhún nhẹ trục X
      starMesh.rotation.y += delta * 0.48 * motion
      starEdgeMesh.rotation.y = starMesh.rotation.y

      starMesh.rotation.x = Math.sin(time * 1.3) * 0.14 * motion
      starEdgeMesh.rotation.x = starMesh.rotation.x

      // 2. Lõi năng lượng lượng tử xoay ngược chiều và đập nhịp nhàng
      innerCoreMesh.rotation.y -= delta * 0.65 * motion
      innerCoreMesh.rotation.z += delta * 0.35 * motion
      const corePulse = 1.0 + Math.sin(time * 2.8) * 0.1 * motion
      innerCoreMesh.scale.set(corePulse, corePulse, corePulse)

      // 3. Vệ tinh dấu cộng (+) lơ lửng và xoay nhẹ
      const plusPulse = 1.0 + Math.sin(time * 3.2) * 0.08 * motion
      plusGroup.scale.set(plusPulse, plusPulse, plusPulse)
      plusGroup.rotation.z += delta * 0.35 * motion
      plusGroup.position.y = 1.08 + Math.sin(time * 2.2) * 0.06 * motion

      // 4. Vệ tinh vòng tròn (•) xoay vòng và bồng bềnh
      dotGroup.rotation.z -= delta * 0.45 * motion
      dotGroup.position.x = -1.22 + Math.cos(time * 1.9) * 0.05 * motion

      // 5. Hai hạt beacon di chuyển trên 2 vành quỹ đạo
      beacon1Angle += delta * 2.1 * motion
      beacon1Mesh.position.x = Math.cos(beacon1Angle) * orbit1Radius
      beacon1Mesh.position.y = Math.sin(beacon1Angle) * orbit1Radius

      beacon2Angle -= delta * 1.7 * motion
      beacon2Mesh.position.x = Math.cos(beacon2Angle) * orbit2Radius
      beacon2Mesh.position.y = Math.sin(beacon2Angle) * orbit2Radius

      // 6. Cả cụm bồng bềnh nhẹ theo trục Y
      mainGroup.position.y = Math.sin(time * 1.4) * 0.07 * motion

      // 7. Parallax mượt mà theo chuột và cuộn trang
      currentMouseX += (targetMouseX - currentMouseX) * 0.06
      currentMouseY += (targetMouseY - currentMouseY) * 0.06
      currentScrollY += (targetScrollY - currentScrollY) * 0.08

      mainGroup.rotation.y = currentScrollY + currentMouseX
      mainGroup.rotation.x = currentMouseY

      renderer?.render(scene, camera)
    }

    animate()

    // Dọn dẹp tài nguyên
    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('edumap-theme-changed', handleThemeChange)
      observer.disconnect()

      starGeo.dispose()
      starMat.dispose()
      starEdges.dispose()
      starEdgeMat.dispose()
      innerCoreGeo.dispose()
      innerCoreMat.dispose()
      plusBarHGeo.dispose()
      plusBarVGeo.dispose()
      plusMat.dispose()
      plusGemGeo.dispose()
      plusGemMat.dispose()
      ringGeo.dispose()
      ringMat.dispose()
      coreDotGeo.dispose()
      coreDotMat.dispose()
      orbit1Geo.dispose()
      orbit1Mat.dispose()
      beacon1Geo.dispose()
      beacon1Mat.dispose()
      orbit2Geo.dispose()
      orbit2Mat.dispose()
      beacon2Geo.dispose()
      beacon2Mat.dispose()

      if (renderer) {
        renderer.dispose()
        renderer.forceContextLoss()
        if (renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement)
        }
      }
    }
  }, [])

  if (!hasWebGL) {
    return (
      <div
        className={`pointer-events-none select-none flex items-center justify-center ${className}`}
        aria-hidden='true'
      >
        <img src='/favicon.svg' alt='EduMap AI' className='w-16 h-16 object-contain animate-pulse' />
      </div>
    )
  }

  return <div ref={containerRef} aria-hidden='true' className={`pointer-events-none select-none ${className}`} />
}
