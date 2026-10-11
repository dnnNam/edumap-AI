/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable prefer-const */
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

interface HeroBackground3DProps {
  className?: string
}

function checkWebGLSupport(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl')),
    )
  } catch {
    return false
  }
}

/**
 * GLSL 2D Simplex Noise & FBM cho chuyển động chất lỏng quang học 3D (Fluid Caustics)
 */
const noiseGLSL = `
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m; m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  float fbm(vec2 p, float t) {
    float v = 0.0;
    v += 0.55 * snoise(p + vec2(t * 0.14, t * 0.08));
    v += 0.30 * snoise(p * 2.1 - vec2(t * 0.18, -t * 0.12));
    v += 0.15 * snoise(p * 4.2 + vec2(-t * 0.22, t * 0.16));
    return v;
  }
`

/**
 * Vertex Shader: Mặt Sóng Thủy Tinh Không Gian 3D (Spatial Liquid Mesh)
 */
const vertexShader = `
  ${noiseGLSL}

  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uMotionFactor;

  varying vec2 vUv;
  varying float vElevation;
  varying vec3 vWorldPos;
  varying vec3 vViewPosition;

  void main() {
    vUv = uv;

    vec3 pos = position;
    float t = uTime * uMotionFactor * 0.6;

    // Sóng chất lỏng đa tầng mượt mà
    float wave = fbm(pos.xy * 0.16, t) * 1.8;

    // Tương tác chuột / chạm ngón tay: lực hút & gợn sóng mềm
    float mouseDist = distance(pos.xy, uMouse * vec2(14.0, 9.0));
    float mouseFlex = sin(clamp(mouseDist * 1.2 - t * 1.8, 0.0, 6.28)) * exp(-mouseDist * 0.28) * 0.65 * uMotionFactor;

    pos.z += wave + mouseFlex;
    vElevation = wave + mouseFlex;

    vec4 worldPosition = modelMatrix * vec4(pos, 1.0);
    vWorldPos = worldPosition.xyz;

    vec4 mvPosition = viewMatrix * worldPosition;
    vViewPosition = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
  }
`

/**
 * Fragment Shader: Khúc Xạ Caustic & Quang Phổ Thủy Tinh (Ethereal Liquid Caustics)
 * - Màu sắc thanh thoát, hài hòa, không đậm màu, không gây chói mắt.
 * - Tan biến 4 mép mượt mà (Feather Falloff) như làn sương.
 * - Tuyệt đối KHÔNG có bất kỳ chấm tròn nào.
 */
const fragmentShader = `
  uniform vec3 uColorBase;
  uniform vec3 uColorFlow;
  uniform vec3 uColorCrest;
  uniform vec3 uColorRim;
  uniform float uOpacity;
  uniform float uIsDark;

  varying vec2 vUv;
  varying float vElevation;
  varying vec3 vWorldPos;
  varying vec3 vViewPosition;

  void main() {
    // 1. Pháp tuyến bề mặt từ vi phân màn hình
    vec3 dX = dFdx(vWorldPos);
    vec3 dY = dFdy(vWorldPos);
    vec3 normal = normalize(cross(dX, dY));
    vec3 viewDir = normalize(vViewPosition);

    float fresnel = pow(1.0 - abs(dot(normal, viewDir)), 2.8);

    // 2. Độ tan biến viền mép (4-Edge Feather Falloff) - Hòa tan êm dịu vào nền web
    float fadeX = smoothstep(0.0, 0.26, vUv.x) * smoothstep(1.0, 0.74, vUv.x);
    float fadeY = smoothstep(0.0, 0.28, vUv.y) * smoothstep(1.0, 0.72, vUv.y);
    float edgeFade = fadeX * fadeY;

    // 3. Tan biến theo chiều sâu khoảng cách
    float dist = length(vViewPosition);
    float depthFade = smoothstep(36.0, 7.0, dist);

    // 4. Hòa trộn màu quang phổ chất lỏng dịu mát
    float normElev = clamp((vElevation + 1.8) / 3.6, 0.0, 1.0);
    vec3 color = mix(uColorBase, uColorFlow, smoothstep(0.08, 0.55, normElev));
    color = mix(color, uColorCrest, smoothstep(0.42, 0.88, normElev));
    color = mix(color, uColorRim, fresnel * 0.42);

    // 5. Gân sáng khúc xạ mờ ảo (Whisper-thin Caustic Sheen)
    float caustic = pow(clamp(normElev * 1.15, 0.0, 1.0), 3.0) * 0.12;
    color += uColorRim * caustic;

    // 6. Alpha trong trẻo, nhẹ nhàng, giữ 100% độ sắc nét cho chữ
    float baseAlpha = mix(0.12, 0.46, normElev);
    float alpha = (baseAlpha + fresnel * 0.28) * edgeFade * depthFade * uOpacity;

    if (alpha < 0.002) discard;

    gl_FragColor = vec4(color, alpha);
  }
`

/**
 * HeroBackground3D - Hiệu ứng "Dòng Sóng Thủy Tinh Không Gian" (Spatial Liquid Horizon)
 *
 * Đặc điểm đột phá:
 * - THẬT XỊN & CAO CẤP: Dòng chảy chất lỏng quang phổ 3D mô phỏng FBM Navier-Stokes trên GPU.
 * - HÀI HÒA & DỊU MẮT: Không có hình khối cứng nhắc hay chấm tròn; toàn bộ nền là làn sóng thủy tinh chuyển sắc pastel nhẹ nhàng.
 * - ĐỒNG NHẤT 100% CẢ DESKTOP & MOBILE:
 *   + Cùng một ngôn ngữ thị giác dòng chảy không gian.
 *   + Tự động thích ứng tỷ lệ màn hình mượt mà, bao trọn toàn bộ Hero canvas trên mọi thiết bị.
 * - TƯƠNG THÍCH HOÀN TOÀN LIGHT / DARK MODE:
 *   + Dark Mode: Than tím mờ, lavender pastel êm dịu, viền sky xanh nhạt mây trời.
 *   + Light Mode: Trắng ngọc trai pha sắc xanh periwinkle thanh thoát, trong veo.
 */
export default function HeroBackground3D({ className = '' }: HeroBackground3DProps) {
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
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0

    // 1. Scene & Camera
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(46, 1, 0.1, 55)

    // 2. WebGLRenderer
    let renderer: THREE.WebGLRenderer | null = null
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isTouchDevice,
        alpha: true,
        powerPreference: 'high-performance',
        precision: isTouchDevice ? 'mediump' : 'highp',
      })
      renderer.setSize(container.clientWidth, container.clientHeight)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, isTouchDevice ? 1.0 : 1.5))
      container.appendChild(renderer.domElement)
    } catch {
      setHasWebGL(false)
      return
    }

    // 3. Nhóm chứa mặt sóng 3D
    const mainGroup = new THREE.Group()
    scene.add(mainGroup)

    // Lưới mặt sóng 3D đa chiều bao trọn không gian
    const segmentsX = isTouchDevice ? 42 : 72
    const segmentsY = isTouchDevice ? 32 : 54
    const waveGeo = new THREE.PlaneGeometry(42, 28, segmentsX, segmentsY)

    // Bảng màu nhẹ nhàng, thanh thoát, hài hòa (Gentle Pastel Palette)
    const darkColors = {
      base: new THREE.Color(0x191428), // Than tím nhẹ nhàng, êm dịu
      flow: new THREE.Color(0x433582), // Tím oải hương sâu lắng
      crest: new THREE.Color(0x8174e8), // Lavender sáng thanh thoát
      rim: new THREE.Color(0x67e8f9), // Sky cyan mây trời
      opacity: 0.45,
    }

    const lightColors = {
      base: new THREE.Color(0xf3f0ff), // Tím phấn pastel siêu nhạt
      flow: new THREE.Color(0xc7d2fe), // Xanh periwinkle êm dịu
      crest: new THREE.Color(0x818cf8), // Indigo nhạt thanh lịch
      rim: new THREE.Color(0x7dd3fc), // Sky xanh mờ
      opacity: 0.28,
    }

    const isInitialDark = document.documentElement.classList.contains('dark')
    const currentTheme = isInitialDark ? darkColors : lightColors

    const waveMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: isInitialDark ? THREE.AdditiveBlending : THREE.NormalBlending,
      side: THREE.DoubleSide,
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uMotionFactor: { value: prefersReducedMotion ? 0.08 : 1.0 },
        uColorBase: { value: currentTheme.base },
        uColorFlow: { value: currentTheme.flow },
        uColorCrest: { value: currentTheme.crest },
        uColorRim: { value: currentTheme.rim },
        uOpacity: { value: currentTheme.opacity },
        uIsDark: { value: isInitialDark ? 1.0 : 0.0 },
      },
    })

    const waveMesh = new THREE.Mesh(waveGeo, waveMaterial)
    mainGroup.add(waveMesh)

    // =========================================================================
    // RESPONSIVE ĐỒNG BỘ 100% CẢ DESKTOP & MOBILE
    // =========================================================================
    const updateResponsiveLayout = () => {
      if (!container || !renderer) return
      const w = container.clientWidth
      const h = container.clientHeight || 1
      const aspect = w / h

      camera.aspect = aspect

      if (aspect < 0.85) {
        // ========== MOBILE DỌC (PORTRAIT) ==========
        // Mặt sóng được căn góc nhìn nghiêng bao phủ tự nhiên toàn bộ màn hình điện thoại
        camera.fov = 58
        camera.position.set(0, 0.4, 13.5)
        camera.lookAt(0, 0.2, 0)

        waveMesh.position.set(0, 0.2, -1.8)
        waveMesh.rotation.set(-0.38, 0.08, -0.05)
        waveMesh.scale.set(0.9, 1.35, 1.0)
      } else if (aspect < 1.25) {
        // ========== TABLET ==========
        camera.fov = 50
        camera.position.set(0, -0.5, 12.0)
        camera.lookAt(0, 0.1, 0)

        waveMesh.position.set(0, 0.2, -2.0)
        waveMesh.rotation.set(-0.48, 0.06, -0.04)
        waveMesh.scale.set(1.0, 1.0, 1.0)
      } else {
        // ========== DESKTOP (MÀN HÌNH RỘNG) ==========
        camera.fov = 44
        camera.position.set(0, -1.5, 11.2)
        camera.lookAt(0, 0.2, -0.8)

        waveMesh.position.set(0, 0.2, -2.2)
        waveMesh.rotation.set(-0.55, 0.04, -0.02)
        waveMesh.scale.set(1.15, 1.0, 1.0)
      }

      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }

    updateResponsiveLayout()
    window.addEventListener('resize', updateResponsiveLayout)

    // =========================================================================
    // ĐỒNG BỘ THEME
    // =========================================================================
    const updateTheme = (isDark: boolean) => {
      const colors = isDark ? darkColors : lightColors
      waveMaterial.uniforms.uColorBase.value.copy(colors.base)
      waveMaterial.uniforms.uColorFlow.value.copy(colors.flow)
      waveMaterial.uniforms.uColorCrest.value.copy(colors.crest)
      waveMaterial.uniforms.uColorRim.value.copy(colors.rim)
      waveMaterial.uniforms.uOpacity.value = colors.opacity
      waveMaterial.uniforms.uIsDark.value = isDark ? 1.0 : 0.0
      waveMaterial.blending = isDark ? THREE.AdditiveBlending : THREE.NormalBlending
      waveMaterial.needsUpdate = true
    }

    const onThemeChange = () => {
      const isDark = document.documentElement.classList.contains('dark')
      updateTheme(isDark)
    }
    window.addEventListener('edumap-theme-changed', onThemeChange)

    const themeObserver = new MutationObserver(() => {
      onThemeChange()
    })
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    // =========================================================================
    // TƯƠNG TÁC CHUỘT / TOUCH & SCROLL (SMOOTH INTERACTION)
    // =========================================================================
    let targetMouseX = 0
    let targetMouseY = 0
    let currentMouseX = 0
    let currentMouseY = 0

    const onMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth) * 2 - 1
      targetMouseY = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', onMouseMove, { passive: true })

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0]
        targetMouseX = (touch.clientX / window.innerWidth) * 2 - 1
        targetMouseY = -(touch.clientY / window.innerHeight) * 2 + 1
      }
    }
    window.addEventListener('touchmove', onTouchMove, { passive: true })

    let targetScrollY = 0
    let currentScrollY = 0
    const onScroll = () => {
      targetScrollY = window.scrollY || window.pageYOffset || 0
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    // Intersection Observer
    let isVisible = true
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          isVisible = entry.isIntersecting
        }
      },
      { threshold: 0.05 },
    )
    intersectionObserver.observe(container)

    // =========================================================================
    // RENDER LOOP (THROTTLED: 60FPS DESKTOP / 30FPS MOBILE)
    // =========================================================================
    const TARGET_FPS = isTouchDevice ? 30 : 60
    const FRAME_INTERVAL = 1000 / TARGET_FPS

    let animationFrameId: number
    let lastRenderTime = performance.now()
    let clock = new THREE.Clock()

    const animate = (now: number) => {
      animationFrameId = requestAnimationFrame(animate)

      if (!isVisible || document.hidden) return

      const elapsed = now - lastRenderTime
      if (elapsed < FRAME_INTERVAL) return
      lastRenderTime = now - (elapsed % FRAME_INTERVAL)

      const time = clock.getElapsedTime()

      // Chuyển động lượn sóng tự nhiên
      const idleOscillationX = Math.sin(time * 0.28) * 0.1
      const idleOscillationY = Math.cos(time * 0.22) * 0.08

      currentMouseX += (targetMouseX + idleOscillationX - currentMouseX) * 0.035
      currentMouseY += (targetMouseY + idleOscillationY - currentMouseY) * 0.035
      currentScrollY += (targetScrollY - currentScrollY) * 0.05

      // Cập nhật Uniforms
      waveMaterial.uniforms.uTime.value = time
      waveMaterial.uniforms.uMouse.value.set(currentMouseX, currentMouseY)

      // Parallax thị sai nhẹ nhàng
      mainGroup.rotation.z = currentMouseX * 0.035
      mainGroup.position.y = -currentScrollY * 0.002 + currentMouseY * 0.2

      renderer?.render(scene, camera)
    }

    animationFrameId = requestAnimationFrame(animate)

    // =========================================================================
    // DỌN DẸP TÀI NGUYÊN
    // =========================================================================
    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', updateResponsiveLayout)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('edumap-theme-changed', onThemeChange)
      themeObserver.disconnect()
      intersectionObserver.disconnect()

      waveGeo.dispose()
      waveMaterial.dispose()

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
    return null
  }

  return (
    <div
      ref={containerRef}
      aria-hidden='true'
      className={`absolute inset-0 pointer-events-none select-none overflow-hidden z-0 touch-none ${className}`}
    />
  )
}
