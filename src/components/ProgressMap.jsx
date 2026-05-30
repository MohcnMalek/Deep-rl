import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const BP = {
  bg:       '#0a2342',
  surface:  '#0d2b50',
  border:   'rgba(188,214,255,.18)',
  line:     '#bcd6ff',
  muted:    '#7fa3cf',
  text:     '#dce8fb',
  problem:  '#ff7a45',
  mono:     'IBM Plex Mono, monospace',
  title:    'Saira Condensed, sans-serif',
}

const STEPS = [
  { id: 'q-learning',   label: 'Q-TABLE',       path: '/q-learning',   color: '#7ecfff', problem: 'TROP GRANDE' },
  { id: 'dqn',          label: 'DQN',            path: '/dqn',          color: '#7ecfff', problem: 'INSTABLE' },
  { id: 'replay',       label: 'REPLAY+TARGET',  path: '/replay',       color: '#7ecfff', problem: 'PAS CONTINU' },
  { id: 'policy',       label: 'POLICY-BASED',   path: '/policy',       color: '#b39dff', problem: 'VARIANCE' },
  { id: 'actor-critic', label: 'ACTOR-CRITIC',   path: '/actor-critic', color: '#b39dff', problem: 'TROP BRUTAL' },
  { id: 'ppo',          label: 'PPO ✓',          path: '/ppo',          color: '#5dd1a0', problem: null },
]

/* Animated dashed line drawn left-to-right */
function DashLine({ active, delay }) {
  return (
    <svg width="44" height="16" style={{ flexShrink: 0 }}>
      <motion.line
        x1="0" y1="8" x2="38" y2="8"
        stroke={active ? BP.line : 'rgba(188,214,255,.2)'}
        strokeWidth="1"
        strokeDasharray="4 3"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ delay, duration: 0.5 }}
      />
      {/* arrowhead */}
      <motion.polyline
        points="34,5 38,8 34,11"
        stroke={active ? BP.line : 'rgba(188,214,255,.2)'}
        strokeWidth="1"
        fill="none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.4 }}
      />
      {/* tick marks */}
      <line x1="0" y1="5" x2="0" y2="11" stroke="rgba(188,214,255,.3)" strokeWidth="1" />
      <line x1="38" y1="5" x2="38" y2="11" stroke="rgba(188,214,255,.3)" strokeWidth="1" />
    </svg>
  )
}

export default function ProgressMap({ currentId, compact = false }) {
  const navigate = useNavigate()
  const currentIdx = STEPS.findIndex(s => s.id === currentId)

  /* ── COMPACT BAR (top of concept pages) ── */
  if (compact) {
    return (
      <div style={{
        background: BP.surface,
        borderBottom: `1px solid ${BP.border}`,
        padding: '10px 24px',
        overflowX: 'auto',
      }}>
        {/* FIG label */}
        <div style={{
          fontFamily: BP.mono,
          fontSize: '7px',
          color: BP.muted,
          letterSpacing: '0.12em',
          marginBottom: '6px',
          opacity: 0.7,
        }}>
          FIG. 0 — PROGRESSION DEEP RL
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, minWidth: 'max-content' }}>
          {STEPS.map((step, i) => {
            const isCurrent = step.id === currentId
            const isPast = currentIdx > i

            return (
              <div key={step.id} style={{ display: 'flex', alignItems: 'center' }}>
                {/* Node */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  {step.problem && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.07 }}
                      style={{
                        color: BP.problem,
                        fontSize: '7px',
                        fontFamily: BP.mono,
                        background: 'rgba(255,122,69,.08)',
                        border: '1px solid rgba(255,122,69,.25)',
                        padding: '1px 5px',
                        marginBottom: '4px',
                        whiteSpace: 'nowrap',
                        letterSpacing: '0.06em',
                      }}
                    >
                      ⚠ {step.problem}
                    </motion.div>
                  )}
                  <motion.button
                    onClick={() => navigate(step.path)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    style={{
                      background: isCurrent ? step.color : isPast ? `${step.color}18` : 'transparent',
                      border: `1px solid ${isCurrent ? step.color : isPast ? `${step.color}55` : 'rgba(188,214,255,.2)'}`,
                      padding: '3px 10px',
                      cursor: 'pointer',
                      color: isCurrent ? '#0a2342' : isPast ? step.color : BP.muted,
                      fontFamily: BP.mono,
                      fontWeight: isCurrent ? '600' : '400',
                      fontSize: '9px',
                      letterSpacing: '0.08em',
                      whiteSpace: 'nowrap',
                      boxShadow: isCurrent ? `0 0 10px ${step.color}44` : 'none',
                    }}
                  >
                    {step.label}
                  </motion.button>
                </div>

                {i < STEPS.length - 1 && (
                  <DashLine active={isPast || isCurrent} delay={i * 0.07 + 0.1} />
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  /* ── FULL HERO VERSION (Home page) ── */
  return (
    <div style={{ padding: '24px 0 32px', overflowX: 'auto' }}>
      {/* FIG label */}
      <div style={{
        fontFamily: BP.mono,
        fontSize: '8px',
        color: BP.muted,
        letterSpacing: '0.12em',
        marginBottom: '12px',
        paddingLeft: '4px',
        opacity: 0.7,
      }}>
        FIG. 1 — CHAÎNE PROBLÈME → SOLUTION (DEEP RL)
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'flex-start',
        gap: 0,
        minWidth: 'max-content',
        padding: '8px 4px 4px',
      }}>
        {STEPS.map((step, i) => {
          const isCurrent = currentId && step.id === currentId
          const isPast = currentId ? currentIdx > i : false

          return (
            <div key={step.id} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                {/* Problem badge above node */}
                <div style={{ minHeight: '28px', display: 'flex', alignItems: 'flex-end' }}>
                  {step.problem && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 + 0.2 }}
                      style={{
                        color: BP.problem,
                        fontSize: '8px',
                        fontFamily: BP.mono,
                        background: 'rgba(255,122,69,.08)',
                        border: '1px solid rgba(255,122,69,.3)',
                        padding: '2px 7px',
                        whiteSpace: 'nowrap',
                        letterSpacing: '0.06em',
                        position: 'relative',
                      }}
                    >
                      ⚠ {step.problem}
                    </motion.div>
                  )}
                </div>

                {/* Node */}
                <motion.button
                  onClick={() => navigate(step.path)}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.06, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ delay: i * 0.1, duration: 0.35 }}
                  style={{
                    background: isCurrent ? step.color : isPast ? `${step.color}15` : 'rgba(13,43,80,.8)',
                    border: `1px solid ${isCurrent ? step.color : isPast ? `${step.color}66` : 'rgba(188,214,255,.22)'}`,
                    padding: '8px 18px',
                    cursor: 'pointer',
                    color: isCurrent ? '#071c36' : isPast ? step.color : BP.muted,
                    fontFamily: BP.title,
                    fontWeight: isCurrent ? '700' : '500',
                    fontSize: '13px',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    whiteSpace: 'nowrap',
                    boxShadow: isCurrent ? `0 0 18px ${step.color}44` : 'none',
                    position: 'relative',
                  }}
                >
                  {isCurrent && (
                    <motion.span
                      animate={{ opacity: [0.3, 0.7, 0.3] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      style={{
                        position: 'absolute',
                        inset: -4,
                        border: `1px solid ${step.color}55`,
                        pointerEvents: 'none',
                      }}
                    />
                  )}
                  {step.label}
                </motion.button>

                {/* Step label below */}
                <span style={{
                  fontFamily: BP.mono,
                  fontSize: '7px',
                  color: 'rgba(127,163,207,.5)',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}>
                  {i === 0 ? '─ DÉPART' : i === STEPS.length - 1 ? '─ FINAL' : `ÉTAPE ${String(i+1).padStart(2,'0')}`}
                </span>
              </div>

              {/* Connector */}
              {i < STEPS.length - 1 && (
                <div style={{ marginBottom: '20px' }}>
                  <DashLine active={isPast || isCurrent} delay={i * 0.1 + 0.15} />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
