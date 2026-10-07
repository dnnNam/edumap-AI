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
 * HeroSingle3D: Đúng 1 vật thể 3D duy nhất, phóng to ~270px (1.35x), chất liệu tím flat-shaded
 * - Hình học: Icosahedron lớn (detail = 0) + viền EdgesGeometry tím nhạt phát sáng
 * - Vành quỹ đạo elip mảnh + 1 chấm beacon nhỏ chạy vòng quanh
 * - Key light tương phản rõ từng diện mặt cắt + Rim light tím sáng #818CF8
 * - Không dùng transmission/refraction, giữ 60fps mượt mà
 * - Đặt z-0 phía sau nội dung, pointer-events-none, không che chữ, không đẩy layout
 * - Tự dừng render khi ra khỏi màn hình (IntersectionObserver), hỗ trợ prefers-reduced-motion
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

    // Scene & Camera
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(42, container.clientWidth / container.clientHeight, 0.1, 50)
    camera.position.set(0, 0, 5.4)

    let renderer: THREE.WebGLRenderer | null = null
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'low-power',
      })
      renderer.setSize(container.clientWidth, container.clientHeight)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.toneMapping = THREE.ACESFilmicToneMapping
      renderer.toneMappingExposure = 1.15
      container.appendChild(renderer.domElement)
    } catch {
      setHasWebGL(false)
      return
    }

    // ================= ÁNH SÁNG STUDIO TƯƠNG PHẢN RÕ RỆT =================
    // Ambient dịu nhẹ giữ màu tím không bị đen góc khuất
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.1)
    scene.add(ambientLight)

    // Key Light chính: Chiếu chéo từ trên xuống tạo độ chênh lệch sáng/tối sắc nét giữa các mặt phẳng
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5)
    keyLight.position.set(4, 5, 4)
    scene.add(keyLight)

    // Rim Light tím sáng (#818CF8 / indigo-400) đánh viền cạnh sau
    const rimLight = new THREE.PointLight(0x818cf8, 4.0, 12)
    rimLight.position.set(-3.5, 2, 2.5)
    scene.add(rimLight)

    // Fill Light tím đậm (#4F46E5 / indigo-600) giữ khối luôn no màu tím
    const fillLight = new THREE.PointLight(0x4f46e5, 2.2, 10)
    fillLight.position.set(2, -3, 3)
    scene.add(fillLight)

    // ================= 1 VẬT THỂ 3D DUY NHẤT (PHÓNG TO 1.35x) =================
    const mainGroup = new THREE.Group()
    scene.add(mainGroup)

    // Icosahedron nhỏ gọn vừa vặn (radius: 1.05)
    const geo = new THREE.IcosahedronGeometry(1.05, 0)
    const mat = new THREE.MeshPhysicalMaterial({
      color: 0x4f46e5, // màu tím indigo-600 chủ đạo
      flatShading: true, // lộ rõ từng diện cắt hình học sắc nét
      roughness: 0.16,
      metalness: 0.12,
      clearcoat: 0.95,
      clearcoatRoughness: 0.08,
      transparent: true,
      opacity: 0.96,
    })
    const mesh = new THREE.Mesh(geo, mat)
    mainGroup.add(mesh)

    // Viền cạnh mảnh màu tím nhạt phát sáng (EdgesGeometry)
    const edgeGeo = new THREE.EdgesGeometry(geo)
    const edgeMat = new THREE.LineBasicMaterial({
      color: 0xc7d2fe, // indigo-200
      transparent: true,
      opacity: 0.55,
    })
    const edgeMesh = new THREE.LineSegments(edgeGeo, edgeMat)
    mainGroup.add(edgeMesh)

    // Vành quỹ đạo elip tinh tế, nét mảnh
    const orbitGroup = new THREE.Group()
    orbitGroup.rotation.x = Math.PI / 3.2
    orbitGroup.rotation.y = Math.PI / 5.5
    mainGroup.add(orbitGroup)

    const orbitRadius = 1.55
    const orbitGeo = new THREE.TorusGeometry(orbitRadius, 0.012, 12, 64)
    const orbitMat = new THREE.MeshBasicMaterial({
      color: 0xa5b4fc, // indigo-300
      transparent: true,
      opacity: 0.45,
    })
    const orbitMesh = new THREE.Mesh(orbitGeo, orbitMat)
    orbitGroup.add(orbitMesh)

    // 1 Chấm nhỏ beacon chạy quanh vành quỹ đạo
    const beaconGeo = new THREE.SphereGeometry(0.042, 12, 12)
    const beaconMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
    })
    const beaconMesh = new THREE.Mesh(beaconGeo, beaconMat)
    orbitGroup.add(beaconMesh)

    // ================= XOAY KHI SCROLL UI (KHÔNG DÙNG CHUỘT) =================
    let targetScrollY = 0
    let targetScrollX = 0
    let targetScrollZ = 0

    let currentScrollY = 0
    let currentScrollX = 0
    let currentScrollZ = 0

    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop
      // Xoay tỉ lệ theo khoảng cách cuộn trang (mỗi px cuộn tạo góc xoay 3D)
      targetScrollY = scrollY * 0.0045
      targetScrollX = scrollY * 0.0028
      targetScrollZ = scrollY * 0.0015
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Cập nhật ngay vị trí cuộn hiện tại

    // Resize
    const handleResize = () => {
      if (!container || !renderer) return
      const width = container.clientWidth
      const height = container.clientHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }

    window.addEventListener('resize', handleResize)

    // IntersectionObserver tự dừng render khi ngoài màn hình
    let isVisible = true
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        isVisible = e.isIntersecting
      })
    })
    observer.observe(container)

    // Render loop 60fps
    let animationFrameId: number
    let clock = new THREE.Clock()
    let beaconAngle = 0
    let autoRotateY = 0
    let autoRotateX = 0

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)
      if (!isVisible || document.hidden) return

      const delta = clock.getDelta()
      const time = clock.getElapsedTime()

      if (!prefersReducedMotion) {
        // Beacon tiếp tục chạy nhịp nhàng trên vành elip
        beaconAngle += delta * 2.4
        beaconMesh.position.x = Math.cos(beaconAngle) * orbitRadius
        beaconMesh.position.y = Math.sin(beaconAngle) * orbitRadius

        // Trôi bồng bềnh nhẹ
        mainGroup.position.y = Math.sin(time * 1.4) * 0.06

        // Lúc nào cũng xoay liên tục với tốc độ nhanh hơn, mượt mà
        autoRotateY += delta * 0.75
        autoRotateX += delta * 0.35

        // Kết hợp xoay thêm theo thanh cuộn UI với quán tính (smooth lerp)
        currentScrollY += (targetScrollY - currentScrollY) * 0.08
        currentScrollX += (targetScrollX - currentScrollX) * 0.08
        currentScrollZ += (targetScrollZ - currentScrollZ) * 0.08

        mainGroup.rotation.y = autoRotateY + currentScrollY
        mainGroup.rotation.x = autoRotateX + currentScrollX
        mainGroup.rotation.z = currentScrollZ
      }

      renderer?.render(scene, camera)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
      observer.disconnect()

      geo.dispose()
      mat.dispose()
      edgeGeo.dispose()
      edgeMat.dispose()
      orbitGeo.dispose()
      orbitMat.dispose()
      beaconGeo.dispose()
      beaconMat.dispose()

      if (renderer) {
        renderer.dispose()
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
        <svg className='w-32 h-32 text-indigo-400/40 animate-pulse' viewBox='0 0 100 100' fill='none'>
          <polygon
            points='50,15 85,32 85,68 50,85 15,68 15,32'
            stroke='currentColor'
            strokeWidth='1.5'
            fill='rgba(79, 70, 229, 0.08)'
          />
          <circle cx='50' cy='50' r='16' fill='currentColor' opacity='0.25' />
        </svg>
      </div>
    )
  }

  return <div ref={containerRef} aria-hidden='true' className={`pointer-events-none select-none ${className}`} />
}
