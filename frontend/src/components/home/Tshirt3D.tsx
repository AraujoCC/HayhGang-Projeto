import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import * as THREE from 'three'

export default function TShirt3D() {
    const mountRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!mountRef.current) return
        const container = mountRef.current
        const W = container.clientWidth
        const H = container.clientHeight

        // Scene
        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 100)
        camera.position.set(0, 0, 4.5)

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
        renderer.setSize(W, H)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        renderer.setClearColor(0x000000, 0)
        container.appendChild(renderer.domElement)

        // Lights
        const ambient = new THREE.AmbientLight(0xffffff, 0.6)
        scene.add(ambient)
        const dirLight = new THREE.DirectionalLight(0xffffff, 1.2)
        dirLight.position.set(3, 5, 5)
        scene.add(dirLight)
        const rimLight = new THREE.DirectionalLight(0xff3b00, 0.4)
        rimLight.position.set(-3, -2, -3)
        scene.add(rimLight)
        const fillLight = new THREE.DirectionalLight(0xffffff, 0.3)
        fillLight.position.set(-2, 3, 2)
        scene.add(fillLight)

        // --- Build T-shirt geometry from scratch using Shape + extrude ---
        const group = new THREE.Group()
        scene.add(group)

        // Fabric material
        const fabricMat = new THREE.MeshStandardMaterial({
            color: 0xf5f4f0,
            roughness: 0.85,
            metalness: 0.0,
            side: THREE.DoubleSide,
        })
        const fabricDarkMat = new THREE.MeshStandardMaterial({
            color: 0xe8e6e0,
            roughness: 0.9,
            metalness: 0.0,
            side: THREE.DoubleSide,
        })

        // ---- BODY ----
        const bodyShape = new THREE.Shape()
        bodyShape.moveTo(-1.0, -1.6)
        bodyShape.lineTo(-1.0, 0.9)
        bodyShape.lineTo(-1.35, 1.1)  // shoulder left bottom
        bodyShape.lineTo(-0.35, 0.55) // armpit left
        bodyShape.lineTo(-0.35, 0.9)  // neck-left
        // neck curve
        bodyShape.quadraticCurveTo(-0.35, 1.12, 0, 1.12)
        bodyShape.quadraticCurveTo(0.35, 1.12, 0.35, 0.9)
        bodyShape.lineTo(0.35, 0.55)  // armpit right
        bodyShape.lineTo(1.35, 1.1)   // shoulder right bottom
        bodyShape.lineTo(1.0, 0.9)
        bodyShape.lineTo(1.0, -1.6)
        bodyShape.lineTo(-1.0, -1.6)

        const extrudeSettings = { depth: 0.12, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.03, bevelSegments: 3 }
        const bodyGeo = new THREE.ExtrudeGeometry(bodyShape, extrudeSettings)
        const body = new THREE.Mesh(bodyGeo, fabricMat)
        body.position.z = -0.06
        group.add(body)

        // ---- LEFT SLEEVE ----
        const sleeveL = new THREE.Shape()
        sleeveL.moveTo(-0.35, 0.55)
        sleeveL.lineTo(-1.35, 1.1)
        sleeveL.lineTo(-2.1, 0.85)
        sleeveL.lineTo(-2.0, 0.35)
        sleeveL.lineTo(-1.05, 0.25)
        sleeveL.lineTo(-0.35, 0.55)
        const sleeveExtL = new THREE.ExtrudeGeometry(sleeveL, { depth: 0.10, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 2 })
        const meshSleeveL = new THREE.Mesh(sleeveExtL, fabricDarkMat)
        meshSleeveL.position.z = -0.05
        group.add(meshSleeveL)

        // ---- RIGHT SLEEVE ----
        const sleeveR = new THREE.Shape()
        sleeveR.moveTo(0.35, 0.55)
        sleeveR.lineTo(1.35, 1.1)
        sleeveR.lineTo(2.1, 0.85)
        sleeveR.lineTo(2.0, 0.35)
        sleeveR.lineTo(1.05, 0.25)
        sleeveR.lineTo(0.35, 0.55)
        const sleeveExtR = new THREE.ExtrudeGeometry(sleeveR, { depth: 0.10, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 2 })
        const meshSleeveR = new THREE.Mesh(sleeveExtR, fabricDarkMat)
        meshSleeveR.position.z = -0.05
        group.add(meshSleeveR)

        // ---- COLLAR ----
        const collarCurve = new THREE.Shape()
        collarCurve.absarc(0, 0, 0.35, 0, Math.PI * 2, false)
        const collarHole = new THREE.Path()
        collarHole.absarc(0, 0, 0.27, 0, Math.PI * 2, true)
        collarCurve.holes.push(collarHole)
        const collarGeo = new THREE.ExtrudeGeometry(collarCurve, { depth: 0.04, bevelEnabled: false })
        const collarMat = new THREE.MeshStandardMaterial({ color: 0xd8d5cc, roughness: 0.9, side: THREE.DoubleSide })
        const collar = new THREE.Mesh(collarGeo, collarMat)
        collar.position.set(0, 0.9, 0.08)
        group.add(collar)

        // ---- LOGO "HG" on chest via canvas texture ----
        const logoCanvas = document.createElement('canvas')
        logoCanvas.width = 256
        logoCanvas.height = 256
        const ctx = logoCanvas.getContext('2d')!
        ctx.clearRect(0, 0, 256, 256)
        ctx.fillStyle = '#1a1a1a'
        ctx.font = 'bold 90px serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText('HG', 128, 128)
        // small text below
        ctx.font = '18px monospace'
        ctx.fillText('HAYH GANG', 128, 180)

        const logoTex = new THREE.CanvasTexture(logoCanvas)
        const logoMat = new THREE.MeshStandardMaterial({ map: logoTex, transparent: true, roughness: 0.8 })
        const logoGeo = new THREE.PlaneGeometry(0.7, 0.7)
        const logoMesh = new THREE.Mesh(logoGeo, logoMat)
        logoMesh.position.set(0, 0.1, 0.19)
        group.add(logoMesh)

        // ---- BOTTOM HEM line ----
        const hemGeo = new THREE.BoxGeometry(2.0, 0.04, 0.14)
        const hemMesh = new THREE.Mesh(hemGeo, collarMat)
        hemMesh.position.set(0, -1.58, 0)
        group.add(hemMesh)

        // Center group
        group.position.set(0, -0.1, 0)

        // ---- Drag rotation ----
        let isDragging = false
        let prevX = 0
        let prevY = 0
        let rotX = 0.05
        let rotY = 0.3
        let velX = 0
        let velY = 0.003 // auto-spin

        const onDown = (e: MouseEvent | TouchEvent) => {
            isDragging = true
            const x = 'touches' in e ? e.touches[0].clientX : e.clientX
            const y = 'touches' in e ? e.touches[0].clientY : e.clientY
            prevX = x; prevY = y
            velX = 0; velY = 0
        }
        const onMove = (e: MouseEvent | TouchEvent) => {
            if (!isDragging) return
            const x = 'touches' in e ? e.touches[0].clientX : e.clientX
            const y = 'touches' in e ? e.touches[0].clientY : e.clientY
            velY = (x - prevX) * 0.01
            velX = (y - prevY) * 0.005
            rotY += velY; rotX += velX
            rotX = Math.max(-0.5, Math.min(0.5, rotX))
            prevX = x; prevY = y
        }
        const onUp = () => { isDragging = false }

        container.addEventListener('mousedown', onDown)
        window.addEventListener('mousemove', onMove)
        window.addEventListener('mouseup', onUp)
        container.addEventListener('touchstart', onDown, { passive: true })
        window.addEventListener('touchmove', onMove, { passive: true })
        window.addEventListener('touchend', onUp)

        // Animation
        let frameId: number
        const animate = () => {
            frameId = requestAnimationFrame(animate)
            if (!isDragging) {
                velY *= 0.96
                velY += 0.002  // gentle auto-spin
                rotY += velY
            }
            group.rotation.y = rotY
            group.rotation.x = rotX
            renderer.render(scene, camera)
        }
        animate()

        // Resize
        const onResize = () => {
            const w = container.clientWidth
            const h = container.clientHeight
            camera.aspect = w / h
            camera.updateProjectionMatrix()
            renderer.setSize(w, h)
        }
        window.addEventListener('resize', onResize)

        return () => {
            cancelAnimationFrame(frameId)
            container.removeEventListener('mousedown', onDown)
            window.removeEventListener('mousemove', onMove)
            window.removeEventListener('mouseup', onUp)
            container.removeEventListener('touchstart', onDown)
            window.removeEventListener('touchmove', onMove)
            window.removeEventListener('touchend', onUp)
            window.removeEventListener('resize', onResize)
            renderer.dispose()
            if (container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement)
            }
        }
    }, [])

    return (
        <section className="bg-ink py-0 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-0 items-center min-h-[600px]">

                    {/* 3D Canvas */}
                    <div
                        ref={mountRef}
                        className="w-full h-[420px] md:h-[600px] cursor-grab active:cursor-grabbing select-none"
                    />

                    {/* Text side */}
                    <div className="py-12 md:py-0 md:pl-8">
                        <p className="text-[#FF3B00] text-[10px] uppercase tracking-[0.4em] mb-3">Nova Coleção — 2025</p>
                        <h2 className="font-display text-5xl md:text-7xl text-white tracking-widest leading-none mb-4">
                            CAMISETA<br />HEAVEN
                        </h2>
                        <p className="text-white/40 text-sm leading-relaxed max-w-xs mb-8">
                            100% algodão penteado. Oversized fit. Estampas exclusivas feitas em Salvador, Bahia.
                        </p>
                        <div className="flex items-baseline gap-3 mb-8">
                            <span className="font-display text-4xl text-white">R$ 169,90</span>
                            <span className="text-white/30 text-xs uppercase tracking-wider line-through">R$ 199,90</span>
                        </div>
                        {/* Color options */}
                        <div className="flex gap-3 mb-8">
                            {['#F5F4F0', '#1A1A1A', '#FF3B00', '#2D4A3E'].map((color, i) => (
                                <button key={i}
                                    className={`w-7 h-7 rounded-full border-2 transition-all hover:scale-110 ${i === 0 ? 'border-white' : 'border-transparent hover:border-white/40'}`}
                                    style={{ background: color }}
                                />
                            ))}
                        </div>
                        <div className="flex gap-3">
                            <Link to="/shop"
                                className="bg-[#FF3B00] text-white px-8 py-4 text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300">
                                COMPRAR
                            </Link>
                            <Link to="/shop"
                                className="border border-white/20 text-white/60 px-8 py-4 text-xs uppercase tracking-widest hover:border-white hover:text-white transition-all duration-300">
                                VER COLEÇÃO
                            </Link>
                        </div>
                        <p className="text-white/20 text-[10px] uppercase tracking-widest mt-6">
                            ↙ Arraste para girar
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}