import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Play, Pause, RotateCcw, SplitSquareHorizontal } from 'lucide-react'

/* ────────────────────────────────────────────────────────────
   TRACK GEOMETRY
   Canvas: 560 × 320
   Outer rounded-rect: (12, 12, 536, 296, 62)
   Inner rounded-rect: (112, 88, 336, 144, 38)
   Centre line (midpoint): cx1=118, cy1=108, cx2=438, cy2=212, r=50
──────────────────────────────────────────────────────────── */
const CW = 560, CH = 320
const OUTER = { x: 12, y: 12, w: 536, h: 296, r: 62 }
const INNER = { x: 112, y: 88, w: 336, h: 144, r: 38 }

function addRoundRect(path, x, y, w, h, r) {
  path.moveTo(x + r, y)
  path.lineTo(x + w - r, y)
  path.arcTo(x + w, y, x + w, y + r, r)
  path.lineTo(x + w, y + h - r)
  path.arcTo(x + w, y + h, x + w - r, y + h, r)
  path.lineTo(x + r, y + h)
  path.arcTo(x, y + h, x, y + h - r, r)
  path.lineTo(x, y + r)
  path.arcTo(x, y, x + r, y, r)
  path.closePath()
}

let outerPath, innerPath
function getPaths() {
  if (!outerPath) {
    outerPath = new Path2D(); addRoundRect(outerPath, OUTER.x, OUTER.y, OUTER.w, OUTER.h, OUTER.r)
    innerPath = new Path2D(); addRoundRect(innerPath, INNER.x, INNER.y, INNER.w, INNER.h, INNER.r)
  }
  return { outerPath, innerPath }
}

function isOnTrack(ctx, x, y) {
  const { outerPath, innerPath } = getPaths()
  return ctx.isPointInPath(outerPath, x, y) && !ctx.isPointInPath(innerPath, x, y)
}

/* ── Waypoints along centre line (clockwise) ── */
const WAYPOINTS = [
  [280, 50], [380, 52], [455, 82], [495, 138], [495, 182], [455, 238],
  [380, 265], [280, 268], [180, 265], [105, 238], [65, 182], [65, 138],
  [105, 82], [180, 52],
]
const WP_RADIUS = 36

/* ────────────────────────────────────────────────────────────
   RL CONSTANTS
──────────────────────────────────────────────────────────── */
const N_RAYS = 5
const RAY_ANGLES = [-Math.PI / 2, -Math.PI / 4, 0, Math.PI / 4, Math.PI / 2]
const RAY_MAX = 110
const RAY_LEVELS = 4   // 0..3
const N_STATES = Math.pow(RAY_LEVELS, N_RAYS) // 1024
const N_ACTIONS = 3    // 0=left, 1=straight, 2=right
const TURN = 0.072     // ~4.1° in radians
const SPEED = 2.6
const ALPHA = 0.20
const GAMMA = 0.95
const EPS_DECAY = 0.997
const EPS_MIN = 0.05
const MAX_STEPS = 600

/* ── Q-table ── */
function freshQ() { return new Float32Array(N_STATES * N_ACTIONS) }

function qGet(Q, s, a) { return Q[s * N_ACTIONS + a] }
function qSet(Q, s, a, v) { Q[s * N_ACTIONS + a] = v }

function bestAction(Q, s) {
  let best = 0, bv = qGet(Q, s, 0)
  for (let a = 1; a < N_ACTIONS; a++) { const v = qGet(Q, s, a); if (v > bv) { bv = v; best = a } }
  return best
}

/* ── State encoding ── */
function castRay(ctx, x, y, angle) {
  for (let d = 1; d <= RAY_MAX; d += 2) {
    const rx = x + Math.cos(angle) * d
    const ry = y + Math.sin(angle) * d
    if (!isOnTrack(ctx, rx, ry)) return d
  }
  return RAY_MAX
}

function getState(ctx, x, y, heading) {
  let s = 0
  for (let i = 0; i < N_RAYS; i++) {
    const d = castRay(ctx, x, y, heading + RAY_ANGLES[i])
    const level = Math.min(3, Math.floor(d / (RAY_MAX / RAY_LEVELS)))
    s = s * RAY_LEVELS + level
  }
  return s
}

/* ── Episode runner (synchronous, for a single step) ── */
function createCar(x = 280, y = 50, heading = 0) {
  return { x, y, heading, wpIdx: 0, steps: 0, totalR: 0, alive: true, laps: 0 }
}

function stepCar(ctx, car, action) {
  const turn = action === 0 ? -TURN : action === 2 ? TURN : 0
  const newH = car.heading + turn
  const nx = car.x + Math.cos(newH) * SPEED
  const ny = car.y + Math.sin(newH) * SPEED

  if (!isOnTrack(ctx, nx, ny)) {
    return { ...car, alive: false, totalR: car.totalR - 5 }
  }

  // Waypoint progress
  let wpIdx = car.wpIdx, laps = car.laps
  const [wx, wy] = WAYPOINTS[wpIdx]
  if (Math.hypot(nx - wx, ny - wy) < WP_RADIUS) {
    wpIdx = (wpIdx + 1) % WAYPOINTS.length
    if (wpIdx === 0) laps++
  }

  return {
    ...car,
    x: nx, y: ny, heading: newH,
    wpIdx, laps,
    steps: car.steps + 1,
    totalR: car.totalR + 0.05 + (wpIdx !== car.wpIdx ? 1 : 0),
  }
}

/* ────────────────────────────────────────────────────────────
   DRAW HELPERS
──────────────────────────────────────────────────────────── */
const BP_BG   = '#0a2342'
const BP_LINE = 'rgba(188,214,255,.5)'
const BP_DIM  = 'rgba(188,214,255,.18)'
const BP_CAR  = '#dce8fb'
const BP_RAY  = 'rgba(126,207,255,.55)'
const BP_TRAIL= 'rgba(126,207,255,.25)'
const BP_GRID = 'rgba(180,210,255,.05)'

function drawGrid(ctx, w, h) {
  ctx.strokeStyle = BP_GRID
  ctx.lineWidth = 0.5
  for (let x = 0; x < w; x += 20) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke() }
  for (let y = 0; y < h; y += 20) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke() }
  ctx.strokeStyle = 'rgba(180,210,255,.1)'
  for (let x = 0; x < w; x += 100) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke() }
  for (let y = 0; y < h; y += 100) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(0+w, y); ctx.stroke() }
}

function drawTrack(ctx) {
  const { outerPath, innerPath } = getPaths()
  // Fill track area
  ctx.save()
  ctx.fillStyle = 'rgba(10,43,80,.6)'
  ctx.fill(outerPath)
  ctx.fillStyle = BP_BG
  ctx.fill(innerPath)
  ctx.restore()

  // Outer boundary - dashed cyan
  ctx.save()
  ctx.setLineDash([6, 4])
  ctx.strokeStyle = BP_LINE
  ctx.lineWidth = 1.2
  ctx.stroke(outerPath)

  // Inner boundary
  ctx.strokeStyle = BP_LINE
  ctx.stroke(innerPath)
  ctx.restore()

  // Centre line - fine dashed
  ctx.save()
  ctx.setLineDash([3, 5])
  ctx.strokeStyle = 'rgba(188,214,255,.2)'
  ctx.lineWidth = 0.8
  const centrePath = new Path2D()
  addRoundRect(centrePath, 64, 54, 432, 212, 50)
  ctx.stroke(centrePath)
  ctx.restore()
}

function drawWaypoints(ctx, wpIdx) {
  WAYPOINTS.forEach(([wx, wy], i) => {
    ctx.save()
    ctx.beginPath()
    ctx.arc(wx, wy, 3, 0, Math.PI * 2)
    ctx.fillStyle = i < wpIdx ? 'rgba(93,209,160,.5)' : 'rgba(188,214,255,.15)'
    ctx.fill()
    ctx.restore()
  })
}

function drawCar(ctx, car, rays, drawRays) {
  const { x, y, heading } = car
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(heading)

  // Body
  ctx.strokeStyle = BP_CAR
  ctx.lineWidth = 1
  ctx.setLineDash([])
  ctx.strokeRect(-8, -5, 16, 10)
  // Heading indicator
  ctx.fillStyle = '#7ecfff'
  ctx.fillRect(5, -2, 4, 4)

  ctx.restore()

  // LIDAR rays
  if (drawRays && rays) {
    rays.forEach((d, i) => {
      const angle = heading + RAY_ANGLES[i]
      const ex = x + Math.cos(angle) * d
      const ey = y + Math.sin(angle) * d
      ctx.save()
      ctx.setLineDash([2, 3])
      ctx.strokeStyle = d < 30 ? 'rgba(255,122,69,.7)' : BP_RAY
      ctx.lineWidth = 0.8
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(ex, ey); ctx.stroke()
      // endpoint dot
      ctx.beginPath(); ctx.arc(ex, ey, 2, 0, Math.PI * 2)
      ctx.fillStyle = d < 30 ? 'rgba(255,122,69,.7)' : 'rgba(126,207,255,.6)'
      ctx.fill()
      ctx.restore()
    })
  }
}

function drawTrail(ctx, trail) {
  if (trail.length < 2) return
  ctx.save()
  ctx.setLineDash([2, 4])
  ctx.strokeStyle = BP_TRAIL
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(trail[0][0], trail[0][1])
  for (let i = 1; i < trail.length; i++) ctx.lineTo(trail[i][0], trail[i][1])
  ctx.stroke()
  ctx.restore()
}

/* ────────────────────────────────────────────────────────────
   REACT COMPONENT
──────────────────────────────────────────────────────────── */
const BP = {
  surface: '#0d2b50',
  border:  'rgba(188,214,255,.18)',
  text:    '#dce8fb',
  muted:   '#7fa3cf',
  mono:    'IBM Plex Mono, monospace',
  title:   'Saira Condensed, sans-serif',
  problem: '#ff7a45',
  solution:'#5dd1a0',
  cyan:    '#7ecfff',
}

export default function SelfDrivingSim() {
  const canvasRef   = useRef(null)
  const canvasLRef  = useRef(null) // before/after left
  const canvasRRef  = useRef(null) // before/after right
  const ctxRef      = useRef(null)
  const ctxLRef     = useRef(null)
  const ctxRRef     = useRef(null)

  const QRef        = useRef(freshQ())
  const carRef      = useRef(createCar())
  const trailRef    = useRef([])
  const epsilonRef  = useRef(1.0)
  const episodeRef  = useRef(0)
  const bestDistRef = useRef(0)
  const crashesRef  = useRef(0)
  const raysRef     = useRef(Array(N_RAYS).fill(RAY_MAX))

  const trainedQRef    = useRef(null)  // snapshot for comparison
  const replayCarLRef  = useRef(null)  // random car
  const replayCarRRef  = useRef(null)  // trained car
  const replayTrailLRef= useRef([])
  const replayTrailRRef= useRef([])

  const [running,     setRunning]     = useState(false)
  const [comparing,   setComparing]   = useState(false)
  const [episode,     setEpisode]     = useState(0)
  const [epsilon,     setEpsilon]     = useState(1.0)
  const [bestDist,    setBestDist]    = useState(0)
  const [crashes,     setCrashes]     = useState(0)
  const [chartData,   setChartData]   = useState([])
  const [simSpeed,    setSimSpeed]    = useState(6)

  const runningRef   = useRef(false)
  const comparingRef = useRef(false)
  const simSpeedRef  = useRef(6)

  runningRef.current   = running
  comparingRef.current = comparing
  simSpeedRef.current  = simSpeed

  /* ── Off-screen ctx for physics ── */
  const physicsCanvas = useRef(null)
  const physicsCtx    = useRef(null)

  useEffect(() => {
    physicsCanvas.current = document.createElement('canvas')
    physicsCanvas.current.width = CW
    physicsCanvas.current.height = CH
    physicsCtx.current = physicsCanvas.current.getContext('2d')
    getPaths() // warm up path cache
  }, [])

  /* ── Reset ── */
  const reset = useCallback(() => {
    QRef.current     = freshQ()
    carRef.current   = createCar()
    trailRef.current = []
    epsilonRef.current = 1.0
    episodeRef.current = 0
    bestDistRef.current = 0
    crashesRef.current  = 0
    raysRef.current = Array(N_RAYS).fill(RAY_MAX)
    trainedQRef.current = null
    setRunning(false); setComparing(false)
    setEpisode(0); setEpsilon(1.0)
    setBestDist(0); setCrashes(0); setChartData([])
  }, [])

  /* ── Q-learning step (no rendering) ── */
  const qlStep = useCallback(() => {
    const pctx = physicsCtx.current
    if (!pctx) return
    const car = carRef.current
    if (!car.alive) {
      // new episode
      crashesRef.current++
      if (car.totalR > bestDistRef.current) bestDistRef.current = car.totalR
      const ep = ++episodeRef.current
      epsilonRef.current = Math.max(EPS_MIN, epsilonRef.current * EPS_DECAY)
      setChartData(prev => [...prev.slice(-120), { ep, r: parseFloat(car.totalR.toFixed(2)) }])
      if (ep % 5 === 0) {
        setEpisode(ep); setEpsilon(+epsilonRef.current.toFixed(3))
        setBestDist(+bestDistRef.current.toFixed(1))
        setCrashes(crashesRef.current)
      }
      carRef.current = createCar()
      trailRef.current = []
      return
    }

    const { x, y, heading } = car

    // Get current state & rays
    const rays = RAY_ANGLES.map(ra => castRay(pctx, x, y, heading + ra))
    raysRef.current = rays
    const s = getState(pctx, x, y, heading)

    // ε-greedy
    const a = Math.random() < epsilonRef.current
      ? Math.floor(Math.random() * N_ACTIONS)
      : bestAction(QRef.current, s)

    const newCar = stepCar(pctx, car, a)
    const { x: nx, y: ny, heading: nh } = newCar

    const s2 = newCar.alive ? getState(pctx, nx, ny, nh) : s
    const r   = newCar.alive ? (newCar.totalR - car.totalR) : -5

    // Bellman update
    const maxQ2 = newCar.alive
      ? Math.max(...Array.from({ length: N_ACTIONS }, (_, ai) => qGet(QRef.current, s2, ai)))
      : 0
    const target = r + GAMMA * maxQ2
    const old = qGet(QRef.current, s, a)
    qSet(QRef.current, s, a, old + ALPHA * (target - old))

    if (newCar.steps >= MAX_STEPS) newCar.alive = false

    carRef.current = newCar
    if (newCar.alive) trailRef.current = [...trailRef.current.slice(-80), [nx, ny]]
  }, [])

  /* ── Replay step (before/after mode) ── */
  const replayStep = useCallback((side) => {
    const pctx = physicsCtx.current
    if (!pctx) return
    const car    = side === 'L' ? replayCarLRef.current : replayCarRRef.current
    const trailR = side === 'L' ? replayTrailLRef : replayTrailRRef
    if (!car || !car.alive) {
      const fresh = createCar()
      if (side === 'L') replayCarLRef.current = fresh
      else              replayCarRRef.current = fresh
      trailR.current = []
      return
    }
    const { x, y, heading } = car
    const s = getState(pctx, x, y, heading)
    const a = side === 'L'
      ? Math.floor(Math.random() * N_ACTIONS)                  // random
      : bestAction(trainedQRef.current || freshQ(), s)          // trained
    const newCar = stepCar(pctx, car, a)
    if (side === 'L') replayCarLRef.current = newCar
    else              replayCarRRef.current = newCar
    if (newCar.alive) trailR.current = [...trailR.current.slice(-80), [newCar.x, newCar.y]]
    else {
      if (side === 'L') replayCarLRef.current = createCar()
      else              replayCarRRef.current = createCar()
      trailR.current = []
    }
  }, [])

  /* ── Render one frame ── */
  const renderFrame = useCallback(() => {
    const ctx = ctxRef.current
    if (!ctx) return
    ctx.clearRect(0, 0, CW, CH)
    drawGrid(ctx, CW, CH)
    drawTrack(ctx)
    drawWaypoints(ctx, carRef.current.wpIdx)
    drawTrail(ctx, trailRef.current)
    const c = carRef.current
    if (c) drawCar(ctx, c, raysRef.current, true)
  }, [])

  const renderCompare = useCallback((side) => {
    const ctx = side === 'L' ? ctxLRef.current : ctxRRef.current
    const car   = side === 'L' ? replayCarLRef.current : replayCarRRef.current
    const trail = side === 'L' ? replayTrailLRef.current : replayTrailRRef.current
    if (!ctx || !car) return
    ctx.clearRect(0, 0, CW, CH)
    drawGrid(ctx, CW, CH)
    drawTrack(ctx)
    drawTrail(ctx, trail)
    drawCar(ctx, car, null, false)
  }, [])

  /* ── Main animation loop ── */
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    ctxRef.current = canvas.getContext('2d')
    let rafId
    let lastTime = 0

    const loop = (t) => {
      rafId = requestAnimationFrame(loop)
      if (!runningRef.current && !comparingRef.current) {
        renderFrame()
        return
      }
      const dt = t - lastTime
      if (dt < 16) return
      lastTime = t
      const speed = simSpeedRef.current
      if (runningRef.current) {
        for (let i = 0; i < speed; i++) qlStep()
      }
      if (comparingRef.current) {
        for (let i = 0; i < Math.ceil(speed / 2); i++) {
          replayStep('L')
          replayStep('R')
        }
        renderCompare('L')
        renderCompare('R')
      }
      renderFrame()
    }

    rafId = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafId)
  }, [qlStep, replayStep, renderFrame, renderCompare])

  /* ── Init comparison canvases ── */
  useEffect(() => {
    if (canvasLRef.current) ctxLRef.current = canvasLRef.current.getContext('2d')
    if (canvasRRef.current) ctxRRef.current = canvasRRef.current.getContext('2d')
  }, [comparing])

  /* ── Start comparison mode ── */
  const startCompare = () => {
    trainedQRef.current = new Float32Array(QRef.current)
    replayCarLRef.current = createCar()
    replayCarRRef.current = createCar()
    replayTrailLRef.current = []
    replayTrailRRef.current = []
    setRunning(false)
    setComparing(true)
  }

  const stopCompare = () => setComparing(false)

  /* ────── RENDER ────── */
  return (
    <div style={{ fontFamily: BP.mono }}>

      {/* ── Main canvas ── */}
      {!comparing && (
        <div style={{
          background: BP.surface,
          border: `1px solid ${BP.border}`,
          padding: '0',
          marginBottom: '16px',
          position: 'relative',
        }}>
          {/* Corner marks */}
          <span style={{ position:'absolute', top:0, left:0, color:'rgba(188,214,255,.4)', fontSize:'10px', zIndex:2 }}>┌</span>
          <span style={{ position:'absolute', top:0, right:0, color:'rgba(188,214,255,.4)', fontSize:'10px', zIndex:2 }}>┐</span>
          <span style={{ position:'absolute', bottom:0, left:0, color:'rgba(188,214,255,.4)', fontSize:'10px', zIndex:2 }}>└</span>
          <span style={{ position:'absolute', bottom:0, right:0, color:'rgba(188,214,255,.4)', fontSize:'10px', zIndex:2 }}>┘</span>

          <div style={{ padding:'8px 12px', borderBottom:`1px solid ${BP.border}`, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span style={{ fontSize:'8px', letterSpacing:'0.12em', color:BP.muted, textTransform:'uppercase' }}>
              FIG. 1 — CIRCUIT VOITURE AUTONOME (Q-LEARNING)
            </span>
            <span style={{ fontSize:'8px', color:BP.muted }}>
              ÉTATS: {N_STATES} · ACTIONS: {N_ACTIONS} · LIDAR: {N_RAYS} RAYONS
            </span>
          </div>
          <canvas
            ref={canvasRef}
            width={CW}
            height={CH}
            style={{ display: 'block', background: BP_BG, width: '100%', maxWidth: CW }}
          />
        </div>
      )}

      {/* ── Before/After canvases ── */}
      {comparing && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', marginBottom:'16px' }}>
          {[
            { ref: canvasLRef, label: 'AVANT — POLITIQUE ALÉATOIRE', color: BP.problem },
            { ref: canvasRRef, label: 'APRÈS — POLITIQUE ENTRAÎNÉE', color: BP.solution },
          ].map(({ ref, label, color }, idx) => (
            <div key={idx} style={{ border:`1px solid ${color}44`, background:BP.surface, position:'relative' }}>
              <div style={{ padding:'6px 10px', borderBottom:`1px solid ${color}22`, fontSize:'8px', letterSpacing:'0.1em', color, textTransform:'uppercase' }}>
                {label}
              </div>
              <canvas ref={ref} width={CW} height={CH}
                style={{ display:'block', background:BP_BG, width:'100%' }} />
            </div>
          ))}
        </div>
      )}

      {/* ── Controls ── */}
      <div style={{
        background: BP.surface,
        border: `1px solid ${BP.border}`,
        padding: '12px 16px',
        marginBottom: '12px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px',
        alignItems: 'center',
      }}>
        {/* Play/Pause */}
        {!comparing && (
          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => setRunning(r => !r)}
            style={{
              display:'flex', alignItems:'center', gap:'6px',
              background: running ? 'rgba(255,122,69,.1)' : 'rgba(126,207,255,.1)',
              border: `1px solid ${running ? 'rgba(255,122,69,.4)' : 'rgba(126,207,255,.35)'}`,
              color: running ? BP.problem : BP.cyan,
              padding: '7px 16px', cursor:'pointer',
              fontFamily: BP.title, fontWeight:'700', fontSize:'13px', letterSpacing:'0.08em', textTransform:'uppercase',
            }}
          >
            {running ? <Pause size={13}/> : <Play size={13}/>}
            {running ? 'PAUSE' : 'LANCER'}
          </motion.button>
        )}

        <motion.button
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onClick={reset}
          style={{
            display:'flex', alignItems:'center', gap:'6px',
            background: 'transparent',
            border: `1px solid ${BP.border}`,
            color: BP.muted,
            padding: '7px 14px', cursor:'pointer',
            fontFamily: BP.title, fontWeight:'600', fontSize:'13px', letterSpacing:'0.08em', textTransform:'uppercase',
          }}
        >
          <RotateCcw size={12}/> RESET
        </motion.button>

        {/* Before/After toggle */}
        <motion.button
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onClick={comparing ? stopCompare : startCompare}
          style={{
            display:'flex', alignItems:'center', gap:'6px',
            background: comparing ? 'rgba(93,209,160,.1)' : 'transparent',
            border: `1px solid ${comparing ? 'rgba(93,209,160,.4)' : BP.border}`,
            color: comparing ? BP.solution : BP.muted,
            padding: '7px 14px', cursor:'pointer',
            fontFamily: BP.title, fontWeight:'600', fontSize:'13px', letterSpacing:'0.08em', textTransform:'uppercase',
          }}
        >
          <SplitSquareHorizontal size={12}/> REJOUER AVANT / APRÈS
        </motion.button>

        {/* Speed slider */}
        <div style={{ display:'flex', alignItems:'center', gap:'8px', marginLeft:'auto' }}>
          <span style={{ fontSize:'9px', color:BP.muted, letterSpacing:'0.1em' }}>VITESSE SIM.</span>
          <input
            type="range" min={1} max={20} value={simSpeed}
            onChange={e => setSimSpeed(+e.target.value)}
            style={{ width:'90px', accentColor: BP.cyan }}
          />
          <span style={{ fontSize:'9px', color:BP.cyan, minWidth:'20px' }}>{simSpeed}×</span>
        </div>
      </div>

      {/* ── Live stats ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '8px',
        marginBottom: '12px',
      }}>
        {[
          { label: 'ÉPISODE', value: episode, color: BP.cyan },
          { label: 'EPSILON ε', value: epsilon.toFixed ? epsilon.toFixed(3) : epsilon, color: '#b39dff' },
          { label: 'MEILLEURE DIST.', value: bestDist, color: BP.solution },
          { label: 'SORTIES DE PISTE', value: crashes, color: BP.problem },
        ].map(s => (
          <div key={s.label} style={{
            background: BP.surface,
            border: `1px solid ${BP.border}`,
            padding: '10px 12px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize:'16px', fontWeight:'600', fontFamily:BP.title, color:s.color, letterSpacing:'0.06em' }}>
              {s.value}
            </div>
            <div style={{ fontSize:'7px', color:BP.muted, marginTop:'3px', letterSpacing:'0.1em', textTransform:'uppercase' }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* ── ε slider ── */}
      <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'12px', padding:'8px 12px', background:BP.surface, border:`1px solid ${BP.border}` }}>
        <span style={{ fontSize:'9px', color:BP.muted, letterSpacing:'0.1em', whiteSpace:'nowrap' }}>EPSILON INITIAL</span>
        <input type="range" min={0} max={100} defaultValue={100}
          onChange={e => { epsilonRef.current = e.target.value / 100; setEpsilon(+(e.target.value/100).toFixed(2)) }}
          style={{ flex:1, accentColor:'#b39dff' }}
        />
        <span style={{ fontSize:'9px', color:'#b39dff', minWidth:'30px' }}>{epsilon}</span>
      </div>

      {/* ── Learning curve ── */}
      <div style={{
        background: BP.surface,
        border: `1px solid ${BP.border}`,
        padding: '14px 16px',
        marginBottom: '16px',
        position: 'relative',
      }}>
        <span style={{ position:'absolute', top:0, left:0, color:'rgba(188,214,255,.4)', fontSize:'10px' }}>┌</span>
        <span style={{ position:'absolute', bottom:0, right:0, color:'rgba(188,214,255,.4)', fontSize:'10px' }}>┘</span>
        <div style={{ fontSize:'8px', letterSpacing:'0.12em', color:BP.muted, marginBottom:'10px', textTransform:'uppercase' }}>
          FIG. 2 — COURBE D'APPRENTISSAGE (RÉCOMPENSE PAR ÉPISODE)
        </div>
        <div style={{ height: 160 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(188,214,255,.08)" />
              <XAxis dataKey="ep" stroke="rgba(188,214,255,.3)" tick={{ fontSize: 9, fontFamily: 'IBM Plex Mono', fill: '#7fa3cf' }} />
              <YAxis stroke="rgba(188,214,255,.3)" tick={{ fontSize: 9, fontFamily: 'IBM Plex Mono', fill: '#7fa3cf' }} />
              <Tooltip
                contentStyle={{ background: '#0d2b50', border: '1px solid rgba(188,214,255,.2)', borderRadius: 0, fontSize: 10, fontFamily: 'IBM Plex Mono' }}
                labelStyle={{ color: '#7fa3cf' }}
                itemStyle={{ color: '#7ecfff' }}
              />
              <Line type="monotone" dataKey="r" stroke="#7ecfff" dot={false} strokeWidth={1.2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Pedagogical note ── */}
      <div style={{
        border: '1px dashed rgba(179,157,255,.3)',
        background: 'rgba(179,157,255,.04)',
        padding: '12px 16px',
        fontSize: '11px',
        lineHeight: '1.8',
        color: BP.muted,
        letterSpacing: '0.02em',
      }}>
        <span style={{ color: '#b39dff', fontWeight:'600', display:'block', marginBottom:'4px', fontFamily:'Saira Condensed, sans-serif', fontSize:'13px', letterSpacing:'0.08em', textTransform:'uppercase' }}>
          NOTE PÉDAGOGIQUE
        </span>
        Ici, les actions sont <span style={{ color: BP.text }}>discrétisées</span> (gauche / tout droit / droite) pour tourner
        dans le navigateur. Une vraie voiture autonome a un volant à{' '}
        <span style={{ color: BP.problem }}>angle continu</span> et des pédales à{' '}
        <span style={{ color: BP.problem }}>force variable</span>.
        C'est précisément pourquoi on passe ensuite aux méthodes{' '}
        <span style={{ color: '#b39dff' }}>policy-based</span> et à{' '}
        <span style={{ color: BP.solution }}>PPO</span>, qui gèrent nativement les espaces d'actions continus.
      </div>
    </div>
  )
}
