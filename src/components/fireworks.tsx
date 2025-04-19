/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useEffect, useRef } from "react"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  alpha: number
  color: string
  size: number
  decay: number
  brightness: number
  hue: number
  trail: { x: number; y: number; alpha: number }[]
  life: number
  maxLife: number
  hasSplit: boolean
  flicker?: boolean
  specialEffect?: string
  acceleration?: number
  rotationSpeed?: number
  wiggle?: number
  wiggleSpeed?: number
  wiggleOffset?: number
}

interface Firework {
  x: number
  y: number
  targetX: number
  targetY: number
  speed: number
  angle: number
  controlPoint1: { x: number; y: number }
  controlPoint2: { x: number; y: number }
  progress: number
  particles: Particle[]
  color: string
  exploded: boolean
  pattern: string
  hue: number
  size: number
  specialEffect?: string
  spreadFactor?: number
}

export default function Fireworks() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fireworksRef = useRef<Firework[]>([])
  const animationFrameRef = useRef<number>(0)
  const lastLaunchTimeRef = useRef<number>(0)
  const totalParticlesRef = useRef<number>(0)
  const MAX_FIREWORKS = 20
  const MAX_PARTICLES = 3000

  // Generate a random hue for fireworks
  const getRandomHue = () => {
    return Math.floor(Math.random() * 360)
  }

  // Generate a random pattern for explosion
  const getRandomPattern = () => {
    const patterns = [
      "chrysanthemum",
      "willow",
      "crossette",
      "ring",
      "kamuro",
      "spiral",
      "spherical",
      "scattered",
      "palm",
      "heart",
      "double-burst",
      "strobe",
      "multi-color",
      "star", // New pattern
      "brocade", // New pattern
      "crown", // New pattern
      "weeping-willow", // New pattern
      "fan", // New pattern
    ]
    return patterns[Math.floor(Math.random() * patterns.length)]
  }

  // Get a random special effect
  const getRandomSpecialEffect = () => {
    const effects = ["color-shift", "glitter", "flicker", "accelerate", "decelerate", "wiggle", "none", "none"]
    return effects[Math.floor(Math.random() * effects.length)]
  }

  // Create a new firework
  const createFirework = (canvas: HTMLCanvasElement, x?: number): Firework => {
    const startX = x || Math.random() * canvas.width
    const startY = canvas.height

    // Target the center area of the screen
    const centerX = canvas.width / 2
    const centerY = canvas.height * 0.4

    // Calculate target position near the center (with some variation)
    const targetX = centerX + (Math.random() - 0.5) * (canvas.width * 0.4)
    const targetY = centerY + (Math.random() - 0.5) * (canvas.height * 0.3)

    // Create control points for curved trajectory
    const controlPoint1 = {
      x: startX + (targetX - startX) * 0.3 + (Math.random() * 100 - 50),
      y: startY - (startY - targetY) * 0.3,
    }

    const controlPoint2 = {
      x: startX + (targetX - startX) * 0.7 + (Math.random() * 100 - 50),
      y: startY - (startY - targetY) * 0.7,
    }

    // More vibrant and varied colors
    let hue = getRandomHue()

    // Sometimes create color-themed fireworks
    if (Math.random() < 0.3) {
      // Create themed fireworks with specific color ranges
      const themes = [
        [0, 30], // Red-Orange
        [30, 60], // Yellow-Green
        [180, 240], // Cyan-Blue
        [270, 300], // Purple-Pink
        [320, 350], // Pink-Red
      ]
      const theme = themes[Math.floor(Math.random() * themes.length)]
      hue = theme[0] + Math.random() * (theme[1] - theme[0])
    }

    const pattern = getRandomPattern()
    const size = pattern === "kamuro" ? 2.5 : 1.2 + Math.random() * 1.0
    const specialEffect = Math.random() < 0.5 ? getRandomSpecialEffect() : undefined

    // Add spread factor to make explosions more dispersed
    const spreadFactor = 1.0 + Math.random() * 0.8

    return {
      x: startX,
      y: startY,
      targetX,
      targetY,
      speed: 0.01 + Math.random() * 0.008,
      angle: Math.random() * Math.PI * 2,
      controlPoint1,
      controlPoint2,
      progress: 0,
      particles: [],
      color: `hsl(${hue}, 100%, 50%)`,
      exploded: false,
      pattern,
      hue,
      size,
      specialEffect,
      spreadFactor,
    }
  }

  // Calculate position on a bezier curve
  const getBezierPoint = (t: number, p0: number, p1: number, p2: number, p3: number) => {
    const oneMinusT = 1 - t
    return (
      Math.pow(oneMinusT, 3) * p0 +
      3 * Math.pow(oneMinusT, 2) * t * p1 +
      3 * oneMinusT * Math.pow(t, 2) * p2 +
      Math.pow(t, 3) * p3
    )
  }

  // Create particles based on explosion pattern
  const createParticles = (firework: Firework) => {
    const particles: Particle[] = []
    let particleCount = 200
    const baseHue = firework.hue
    const spreadFactor = firework.spreadFactor || 1.0

    // Adjust particle count based on pattern
    switch (firework.pattern) {
      case "kamuro":
        particleCount = 500
        break
      case "chrysanthemum":
        particleCount = 350
        break
      case "willow":
        particleCount = 300
        break
      case "ring":
        particleCount = 220
        break
      case "spiral":
        particleCount = 250
        break
      case "crossette":
        particleCount = 180
        break
      case "palm":
        particleCount = 280
        break
      case "heart":
        particleCount = 300
        break
      case "double-burst":
        particleCount = 400
        break
      case "strobe":
        particleCount = 150
        break
      case "multi-color":
        particleCount = 350
        break
      case "star":
        particleCount = 320
        break
      case "brocade":
        particleCount = 450
        break
      case "crown":
        particleCount = 280
        break
      case "weeping-willow":
        particleCount = 400
        break
      case "fan":
        particleCount = 250
        break
      default:
        particleCount = 200 + Math.floor(Math.random() * 100)
    }

    // Limit particle count based on total particles
    const availableParticles = MAX_PARTICLES - totalParticlesRef.current
    if (availableParticles < particleCount) {
      particleCount = Math.max(100, availableParticles)
    }

    totalParticlesRef.current += particleCount

    for (let i = 0; i < particleCount; i++) {
      let angle: number
      let speed: number
      let size: number
      let decay: number
      let maxLife = 80 + Math.random() * 40
      const specialEffect = firework.specialEffect
      let flicker = false
      let particleHue = baseHue
      let acceleration = 0
      let rotationSpeed = 0
      let wiggle = 0
      let wiggleSpeed = 0
      const wiggleOffset = Math.random() * Math.PI * 2

      // Configure particle properties based on pattern
      switch (firework.pattern) {
        case "chrysanthemum":
          // Dense center with lines radiating outward
          angle = Math.random() * Math.PI * 2
          speed = (1 + Math.random() * 4) * spreadFactor
          size = i % 5 === 0 ? 1.5 : 0.7
          decay = 0.008 + Math.random() * 0.012
          break

        case "willow":
          // Gravity-heavy particles that fall in arcs
          angle = Math.random() * Math.PI * 2
          speed = (1 + Math.random() * 3) * spreadFactor
          size = 0.8
          decay = 0.006 + Math.random() * 0.008
          maxLife = 150 + Math.random() * 50
          break

        case "crossette":
          // Particles that can split again
          angle = Math.random() * Math.PI * 2
          speed = (1.5 + Math.random() * 3.5) * spreadFactor
          size = 1.2
          decay = 0.012 + Math.random() * 0.018
          break

        case "ring":
          // Forms a circular ring
          angle = (i / particleCount) * Math.PI * 2
          speed = (2 + Math.random() * 1.5) * spreadFactor
          size = 0.8
          decay = 0.018 + Math.random() * 0.012
          break

        case "kamuro":
          // Very dense, slow-falling particles
          angle = Math.random() * Math.PI * 2
          speed = (1 + Math.random() * 2.5) * spreadFactor
          size = 0.5 + Math.random()
          decay = 0.005 + Math.random() * 0.007
          maxLife = 120 + Math.random() * 60
          break

        case "spiral":
          // Spiral pattern
          angle = (i / particleCount) * Math.PI * 20 + firework.angle
          speed = (1 + Math.random() * 3) * spreadFactor
          size = 0.8
          decay = 0.012 + Math.random() * 0.012
          rotationSpeed = 0.05 + Math.random() * 0.05
          break

        case "spherical":
          // Even, sphere-like distribution
          angle = Math.random() * Math.PI * 2
          speed = (1 + Math.random() * 3) * spreadFactor
          size = 0.8
          decay = 0.012 + Math.random() * 0.012
          break

        case "palm":
          // Palm tree effect with upward then falling particles
          angle = -Math.PI / 2 + (Math.random() - 0.5) * 0.6
          speed = (2 + Math.random() * 3) * spreadFactor
          size = 0.8
          decay = 0.008 + Math.random() * 0.01
          maxLife = 120 + Math.random() * 30
          break

        case "heart":
          // Heart shape
          const t = (i / particleCount) * Math.PI * 2
          // Heart shape parametric equation
          const heartX = 16 * Math.pow(Math.sin(t), 3)
          const heartY = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)
          angle = Math.atan2(heartY, heartX)
          speed = (1 + Math.random() * 2) * spreadFactor
          size = 0.9
          decay = 0.01 + Math.random() * 0.015
          break

        case "double-burst":
          // Two-stage explosion
          angle = Math.random() * Math.PI * 2
          speed = (1 + Math.random() * 3) * spreadFactor
          size = 1
          decay = 0.01 + Math.random() * 0.01
          // Second stage will happen via split
          break

        case "strobe":
          // Strobe effect with flickering
          angle = Math.random() * Math.PI * 2
          speed = (0.5 + Math.random() * 2) * spreadFactor
          size = 1.2
          decay = 0.02 + Math.random() * 0.02
          maxLife = 60 + Math.random() * 30
          flicker = true
          break

        case "multi-color":
          // Multi-colored explosion
          angle = Math.random() * Math.PI * 2
          speed = (1 + Math.random() * 3) * spreadFactor
          size = 0.8
          decay = 0.01 + Math.random() * 0.015
          // Random hue for each particle
          particleHue = Math.floor(Math.random() * 360)
          break

        case "star":
          // Star-shaped explosion
          const starPoints = 5
          const starAngle = (i % starPoints) * ((Math.PI * 2) / starPoints)
          const starRadius = 1 + (0.5 * Math.floor(i / starPoints)) / (particleCount / starPoints)
          angle = starAngle
          speed = (1.5 + Math.random() * 2) * starRadius * spreadFactor
          size = 0.9
          decay = 0.01 + Math.random() * 0.015
          break

        case "brocade":
          // Brocade crown effect - dense center with trailing particles
          angle = Math.random() * Math.PI * 2
          speed = (1.2 + Math.random() * 3.5) * spreadFactor
          size = 0.7 + Math.random() * 0.5
          decay = 0.006 + Math.random() * 0.01
          maxLife = 100 + Math.random() * 50
          if (Math.random() > 0.7) {
            acceleration = -0.001 - Math.random() * 0.002
          }
          break

        case "crown":
          // Crown effect - particles that form a crown shape
          angle = (i / particleCount) * Math.PI * 2
          const crownFactor = 1 + 0.3 * Math.sin(angle * 8)
          speed = (1.5 + Math.random() * 1.5) * crownFactor * spreadFactor
          size = 0.8
          decay = 0.01 + Math.random() * 0.015
          break

        case "weeping-willow":
          // Weeping willow effect - long-lasting particles that fall gracefully
          angle = Math.random() * Math.PI * 2
          speed = (0.8 + Math.random() * 2) * spreadFactor
          size = 0.6 + Math.random() * 0.4
          decay = 0.004 + Math.random() * 0.006
          maxLife = 180 + Math.random() * 70
          wiggle = 0.3 + Math.random() * 0.7
          wiggleSpeed = 0.05 + Math.random() * 0.05
          break

        case "fan":
          // Fan-shaped explosion
          const fanAngle = Math.PI / 3 // 60 degrees
          angle = -Math.PI / 2 + (Math.random() - 0.5) * fanAngle
          speed = (1.5 + Math.random() * 3) * spreadFactor
          size = 0.8
          decay = 0.01 + Math.random() * 0.015
          break

        case "scattered":
        default:
          // Random scattered pattern
          angle = Math.random() * Math.PI * 2
          speed = (0.5 + Math.random() * 4) * spreadFactor
          size = 0.7 + Math.random() * 0.8
          decay = 0.018 + Math.random() * 0.022
      }

      // Slight hue variation unless multi-color
      const hueVariation = firework.pattern === "multi-color" ? particleHue : baseHue + Math.random() * 30 - 15

      particles.push({
        x: firework.x,
        y: firework.y,
        vx: Math.cos(angle) * speed * (0.85 + Math.random() * 0.3),
        vy: Math.sin(angle) * speed * (0.85 + Math.random() * 0.3),
        alpha: 1,
        color: `hsl(${hueVariation}, 100%, 50%)`,
        size: size * firework.size,
        decay: decay,
        brightness: 50 + Math.random() * 50,
        hue: hueVariation,
        trail: [],
        life: 0,
        maxLife: maxLife,
        hasSplit: false,
        flicker,
        specialEffect,
        acceleration,
        rotationSpeed,
        wiggle,
        wiggleSpeed,
        wiggleOffset,
      })
    }

    return particles
  }

  // Create a split explosion for crossette effect
  const createSplitExplosion = (particle: Particle, isSecondStage = false) => {
    const particles: Particle[] = []
    const particleCount = isSecondStage ? 12 + Math.floor(Math.random() * 8) : 8 + Math.floor(Math.random() * 6)

    // Check if we can add more particles
    if (totalParticlesRef.current + particleCount > MAX_PARTICLES) {
      return particles
    }

    totalParticlesRef.current += particleCount

    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2
      const speed = 1 + Math.random() * 2
      const hueVariation = particle.hue + Math.random() * 40 - 20

      particles.push({
        x: particle.x,
        y: particle.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: particle.alpha * 0.8,
        color: `hsl(${hueVariation}, 100%, 50%)`,
        size: particle.size * 0.7,
        decay: particle.decay * 1.5,
        brightness: particle.brightness * 0.8,
        hue: hueVariation,
        trail: [],
        life: 0,
        maxLife: particle.maxLife * 0.5,
        hasSplit: true,
        flicker: particle.flicker,
        specialEffect: particle.specialEffect,
        acceleration: particle.acceleration,
        rotationSpeed: particle.rotationSpeed,
        wiggle: particle.wiggle,
        wiggleSpeed: particle.wiggleSpeed,
        wiggleOffset: Math.random() * Math.PI * 2,
      })
    }

    return particles
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Handle clicks to launch fireworks
    const handleClick = (e: MouseEvent) => {
      const fireCount = 2 + Math.floor(Math.random() * 3)
      const centerX = canvas.width / 2

      for (let i = 0; i < fireCount; i++) {
        // Launch from click position but with trajectory toward center
        setTimeout(() => {
          if (fireworksRef.current.length < MAX_FIREWORKS) {
            // Adjust click position to be closer to the center horizontally
            const adjustedX = e.clientX + (centerX - e.clientX) * 0.2 + (Math.random() - 0.5) * 80
            fireworksRef.current.push(createFirework(canvas, adjustedX))
          }
        }, i * 150)
      }
    }

    canvas.addEventListener("click", handleClick)

    // Animation loop
    const animate = (timestamp: number) => {
      // Clear the entire canvas on each frame
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Launch new fireworks periodically with varied timing
      if (timestamp - lastLaunchTimeRef.current > 300 + Math.random() * 700) {
        if (fireworksRef.current.length < MAX_FIREWORKS) {
          const batchSize = 1 + Math.floor(Math.random() * 4)
          const centerX = canvas.width / 2

          // Launch several fireworks at once for a more realistic show
          for (let i = 0; i < batchSize; i++) {
            setTimeout(() => {
              if (fireworksRef.current.length < MAX_FIREWORKS) {
                // Launch from random positions along the bottom, but closer to center
                const launchX = centerX + (Math.random() - 0.5) * (canvas.width * 0.8)
                fireworksRef.current.push(createFirework(canvas, launchX))
              }
            }, i * 150)
          }
        }
        lastLaunchTimeRef.current = timestamp
      }

      // Update and draw fireworks
      fireworksRef.current.forEach((firework, index) => {
        if (!firework.exploded) {
          // Update progress
          firework.progress += firework.speed

          // Calculate current position on the bezier curve
          if (firework.progress >= 1) {
            firework.progress = 1
            firework.exploded = true
            firework.particles = createParticles(firework)
          }

          // Calculate position on bezier curve
          firework.x = getBezierPoint(
            firework.progress,
            firework.x,
            firework.controlPoint1.x,
            firework.controlPoint2.x,
            firework.targetX,
          )

          firework.y = getBezierPoint(
            firework.progress,
            firework.y,
            firework.controlPoint1.y,
            firework.controlPoint2.y,
            firework.targetY,
          )

          // Draw the firework as a small dot (no trail)
          ctx.beginPath()
          ctx.arc(firework.x, firework.y, 2, 0, Math.PI * 2)
          ctx.fillStyle = `hsl(${firework.hue}, 100%, 70%)`
          ctx.fill()
        } else {
          // Update and draw particles
          let particlesAlive = false
          let particleCount = 0
          const newSplitParticles: Particle[] = []

          firework.particles = firework.particles.filter((particle) => {
            // Update particle life
            particle.life++

            // Apply special effects
            if (particle.specialEffect === "accelerate") {
              // Particles speed up over time
              const factor = 1.01
              particle.vx *= factor
              particle.vy *= factor
            } else if (particle.specialEffect === "decelerate") {
              // Particles slow down over time
              const factor = 0.99
              particle.vx *= factor
              particle.vy *= factor
            }

            // Apply acceleration if present
            if (particle.acceleration) {
              const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy)
              if (speed > 0.1) {
                // Prevent stopping completely
                const factor = 1 + particle.acceleration
                particle.vx *= factor
                particle.vy *= factor
              }
            }

            // Apply wiggle effect
            if (particle.wiggle && particle.wiggle > 0) {
              const wiggleAmount =
                particle.wiggle * Math.sin(particle.life * particle.wiggleSpeed! + particle.wiggleOffset!)
              const angle = Math.atan2(particle.vy, particle.vx) + Math.PI / 2
              const wiggleX = Math.cos(angle) * wiggleAmount
              const wiggleY = Math.sin(angle) * wiggleAmount
              particle.vx += wiggleX * 0.05
              particle.vy += wiggleY * 0.05
            }

            // Apply pattern-specific physics
            if (firework.pattern === "willow") {
              particle.vy += 0.06 // Higher gravity effect
              particle.vx *= 0.98 // More air resistance
              particle.vy *= 0.98
            } else if (firework.pattern === "kamuro") {
              particle.vy += 0.02 // Lower gravity for kamuro
              particle.vx *= 0.99
              particle.vy *= 0.99
            } else if (firework.pattern === "palm") {
              // Palm tree effect - stronger gravity after reaching apex
              if (particle.vy > 0) {
                particle.vy += 0.08 // Stronger gravity when falling
              } else {
                particle.vy += 0.03 // Lighter gravity when rising
              }
              particle.vx *= 0.98
            } else if (firework.pattern === "weeping-willow") {
              particle.vy += 0.03 // Lower gravity for weeping willow
              particle.vx *= 0.99 // Less air resistance
              particle.vy *= 0.99
            } else if (firework.pattern === "brocade") {
              particle.vy += 0.04 // Standard gravity
              // Brocade has built-in acceleration/deceleration
            } else {
              // Default physics
              particle.vy += 0.04 // Gravity
              particle.vx *= 0.99 // Air resistance
              particle.vy *= 0.99 // Air resistance
            }

            // Apply rotation for spiral pattern or if rotationSpeed is set
            if (firework.pattern === "spiral" || particle.rotationSpeed) {
              const rotationSpeed = particle.rotationSpeed || 0.05
              const currentAngle = Math.atan2(particle.vy, particle.vx)
              const radius = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy)
              particle.vx = Math.cos(currentAngle + rotationSpeed) * radius
              particle.vy = Math.sin(currentAngle + rotationSpeed) * radius
            }

            // Special effect: color shift
            if (particle.specialEffect === "color-shift") {
              particle.hue = (particle.hue + 1) % 360
            }

            // Special effect: glitter
            let glitter = false
            if (particle.specialEffect === "glitter" && Math.random() > 0.7) {
              glitter = true
            }

            // Crossette pattern - randomly split particles
            if (firework.pattern === "crossette" && !particle.hasSplit && particle.life > 15 && Math.random() < 0.03) {
              particle.hasSplit = true
              newSplitParticles.push(...createSplitExplosion(particle))
            }

            // Double-burst pattern - second explosion
            if (
              firework.pattern === "double-burst" &&
              !particle.hasSplit &&
              particle.life > 20 &&
              particle.life < 30 &&
              Math.random() < 0.08
            ) {
              particle.hasSplit = true
              newSplitParticles.push(...createSplitExplosion(particle, true))
            }

            // Update position
            particle.x += particle.vx
            particle.y += particle.vy

            // Fade out based on life
            if (particle.life >= particle.maxLife) {
              particle.alpha -= particle.decay * 1.5
            } else {
              particle.alpha -= particle.decay
            }

            // Slight color change as it fades
            particle.brightness = Math.max(0, particle.brightness - 0.5)

            if (particle.alpha > 0) {
              particlesAlive = true
              particleCount++

              // Handle flickering effect
              let currentAlpha = particle.alpha
              if (particle.flicker && Math.random() > 0.5) {
                currentAlpha = particle.alpha * (0.3 + Math.random() * 0.7)
              }

              // Draw particle
              ctx.beginPath()
              ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)

              // Use HSL for better color control
              const color = `hsla(${particle.hue}, 100%, ${particle.brightness}%, ${currentAlpha})`
              ctx.fillStyle = color
              ctx.fill()

              // Add glitter effect if needed
              if (glitter) {
                ctx.beginPath()
                ctx.arc(particle.x, particle.y, particle.size * 1.5, 0, Math.PI * 2)
                ctx.fillStyle = `hsla(${particle.hue}, 80%, 90%, ${currentAlpha * 0.3})`
                ctx.fill()
              }

              return true
            }

            totalParticlesRef.current--
            return false
          })

          // Add any new split particles to the firework
          if (newSplitParticles.length > 0) {
            firework.particles = [...firework.particles, ...newSplitParticles]
          }

          // Remove firework if all particles are dead
          if (!particlesAlive) {
            fireworksRef.current.splice(index, 1)
          }
        }
      })

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animationFrameRef.current = requestAnimationFrame(animate)

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas)
      canvas.removeEventListener("click", handleClick)
      cancelAnimationFrame(animationFrameRef.current)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
}
