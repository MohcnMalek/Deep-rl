import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import ProgressMap from '../components/ProgressMap'

const BP = {
  bg:       '#0a2342',
  surface:  '#0d2b50',
  border:   'rgba(188,214,255,.18)',
  text:     '#dce8fb',
  muted:    '#7fa3cf',
  problem:  '#ff7a45',
  solution: '#5dd1a0',
  cyan:     '#7ecfff',
  mono:     'IBM Plex Mono, monospace',
  title:    'Saira Condensed, sans-serif',
}

const STORY = [
  { num:'01', step:'Q-TABLE',       path:'/q-learning',   color:'#7ecfff', desc:'Stocke Q(s,a) dans un tableau en mémoire', problem:'TROP GRANDE quand l\'espace d\'états explose' },
  { num:'02', step:'DQN',           path:'/dqn',          color:'#7ecfff', desc:'Un réseau de neurones approxime Q(s,a)', problem:'INSTABLE — la cible bouge sans cesse' },
  { num:'03', step:'REPLAY+TARGET', path:'/replay',       color:'#7ecfff', desc:'Mémoire tampon + réseau cible gelé', problem:'NE GÈRE PAS les actions continues (angle, vitesse…)' },
  { num:'04', step:'POLICY-BASED',  path:'/policy',       color:'#b39dff', desc:'Apprend directement la politique π(a|s)', problem:'FORTE VARIANCE — apprentissage bruité' },
  { num:'05', step:'ACTOR-CRITIC',  path:'/actor-critic', color:'#b39dff', desc:'Actor décide, Critic évalue → variance réduite', problem:'MISES À JOUR trop brutales, politique détruite' },
  { num:'06', step:'PPO ✓',         path:'/ppo',          color:'#5dd1a0', desc:'Clipping borne le ratio → petits pas sûrs', problem: null },
]

export default function Home() {
  const navigate = useNavigate()

  return (
    <div style={{ padding: '36px 40px 100px', maxWidth: '1020px' }}>

      {/* ── HERO ── */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        style={{ marginBottom: '40px' }}
      >
        {/* Badge */}
        <div style={{
          display: 'inline-block',
          border: '1px solid rgba(126,207,255,.3)',
          background: 'rgba(126,207,255,.05)',
          padding: '3px 12px',
          marginBottom: '14px',
          fontFamily: BP.mono,
          fontSize: '9px',
          color: BP.cyan,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
        }}>
          ▸ DEEP REINFORCEMENT LEARNING · VOITURE AUTONOME · 2026
        </div>

        <h1 style={{
          fontFamily: BP.title,
          fontWeight: '800',
          fontSize: '48px',
          lineHeight: '1.05',
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          margin: '0 0 14px',
          color: BP.text,
        }}>
          UNE SUITE DE PROBLÈMES<br />
          <span style={{ color: BP.cyan }}>ET DE SOLUTIONS</span>
        </h1>

        {/* Dimension line decoration */}
        <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'14px' }}>
          <div style={{ height:'1px', width:'32px', background:BP.cyan, opacity:0.4 }} />
          <div style={{ height:'4px', width:'4px', borderRadius:'50%', background:BP.cyan, opacity:0.4 }} />
          <span style={{ fontFamily:BP.mono, fontSize:'8px', color:BP.muted, letterSpacing:'0.1em' }}>
            6 ALGORITHMES · PROBLÈME → SOLUTION
          </span>
          <div style={{ height:'4px', width:'4px', borderRadius:'50%', background:BP.cyan, opacity:0.4 }} />
          <div style={{ height:'1px', flex:1, background:`linear-gradient(90deg,${BP.cyan}33,transparent)` }} />
        </div>

        <p style={{
          fontFamily: BP.mono,
          color: BP.muted,
          fontSize: '13px',
          lineHeight: '1.8',
          maxWidth: '580px',
        }}>
          Le Deep RL n'est pas une liste d'algorithmes. C'est une{' '}
          <span style={{ color: BP.text }}>histoire continue</span> : chaque
          technique naît pour résoudre la limite de la précédente.
          <br/>Illustrée par le défi de la{' '}
          <span style={{ color: BP.cyan }}>voiture autonome</span> — un des
          grands problèmes ouverts du RL en 2026.
        </p>
      </motion.div>

      {/* ── PROGRESS MAP ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
        style={{
          background: BP.surface,
          border: `1px solid ${BP.border}`,
          padding: '16px 20px',
          marginBottom: '40px',
          position: 'relative',
        }}
      >
        {/* corner marks */}
        <span style={{ position:'absolute', top:0, left:0, color:'rgba(188,214,255,.4)', fontSize:'10px' }}>┌</span>
        <span style={{ position:'absolute', top:0, right:0, color:'rgba(188,214,255,.4)', fontSize:'10px' }}>┐</span>
        <span style={{ position:'absolute', bottom:0, left:0, color:'rgba(188,214,255,.4)', fontSize:'10px' }}>└</span>
        <span style={{ position:'absolute', bottom:0, right:0, color:'rgba(188,214,255,.4)', fontSize:'10px' }}>┘</span>

        <div style={{ fontFamily:BP.mono, fontSize:'7px', color:BP.muted, letterSpacing:'0.12em', marginBottom:'4px', opacity:0.7 }}>
          VUE D'ENSEMBLE — FIL ROUGE COMPLET
        </div>
        <ProgressMap currentId={null} />
      </motion.div>

      {/* ── STORY CARDS ── */}
      <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
        {STORY.map((item, i) => (
          <motion.div
            key={item.step}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.08 * i + 0.35 }}
            style={{ display:'flex', gap:'12px', alignItems:'stretch' }}
          >
            {/* Step card */}
            <motion.button
              whileHover={{ x: 4 }}
              onClick={() => navigate(item.path)}
              style={{
                flex: 1,
                background: BP.surface,
                border: `1px solid rgba(188,214,255,.15)`,
                borderLeft: `3px solid ${item.color}55`,
                padding: '14px 18px',
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                position: 'relative',
              }}
            >
              {/* Number badge */}
              <div style={{
                width: '36px',
                height: '36px',
                border: `1px solid ${item.color}44`,
                background: `${item.color}0d`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: BP.mono,
                fontWeight: '600',
                fontSize: '11px',
                color: item.color,
                flexShrink: 0,
              }}>
                {item.num}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{
                  fontFamily: BP.title,
                  fontWeight: '700',
                  fontSize: '16px',
                  letterSpacing: '0.07em',
                  textTransform: 'uppercase',
                  color: item.color,
                  marginBottom: '2px',
                }}>
                  {item.step}
                </div>
                <div style={{
                  fontFamily: BP.mono,
                  color: BP.muted,
                  fontSize: '11px',
                  letterSpacing: '0.03em',
                }}>
                  {item.desc}
                </div>
              </div>

              {/* Arrow */}
              <svg width="16" height="16" viewBox="0 0 16 16" style={{ opacity:0.4, flexShrink:0 }}>
                <line x1="2" y1="8" x2="14" y2="8" stroke={item.color} strokeWidth="1.2"/>
                <polyline points="10,4 14,8 10,12" fill="none" stroke={item.color} strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
            </motion.button>

            {/* Problem badge column */}
            {item.problem ? (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '3px',
                width: '110px',
                flexShrink: 0,
              }}>
                <div style={{ width:'1px', flex:1, background:'rgba(255,122,69,.2)' }} />
                <div style={{
                  background: 'rgba(255,122,69,.06)',
                  border: '1px solid rgba(255,122,69,.25)',
                  padding: '4px 7px',
                  color: BP.problem,
                  fontFamily: BP.mono,
                  fontSize: '8px',
                  letterSpacing: '0.04em',
                  textAlign: 'center',
                  lineHeight: '1.4',
                }}>
                  ⚠<br/>{item.problem}
                </div>
                <div style={{ width:'1px', flex:1, background:'rgba(255,122,69,.2)' }} />
                <span style={{ color:BP.problem, fontSize:'12px', opacity:0.6 }}>↓</span>
              </div>
            ) : (
              <div style={{ width:'110px', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <div style={{
                  border: '1px solid rgba(93,209,160,.3)',
                  background: 'rgba(93,209,160,.06)',
                  padding: '4px 8px',
                  color: BP.solution,
                  fontFamily: BP.mono,
                  fontSize: '8px',
                  letterSpacing: '0.06em',
                  textAlign: 'center',
                }}>
                  ✓ FINAL
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* ── CTA ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        style={{ marginTop: '40px', display:'flex', gap:'12px', alignItems:'center' }}
      >
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/q-learning')}
          style={{
            background: 'rgba(126,207,255,.08)',
            border: '1px solid rgba(126,207,255,.4)',
            color: BP.cyan,
            padding: '12px 28px',
            cursor: 'pointer',
            fontFamily: BP.title,
            fontWeight: '700',
            fontSize: '15px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          COMMENCER L'HISTOIRE
          <svg width="16" height="16" viewBox="0 0 16 16">
            <line x1="2" y1="8" x2="14" y2="8" stroke="#7ecfff" strokeWidth="1.4"/>
            <polyline points="10,4 14,8 10,12" fill="none" stroke="#7ecfff" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/simulation')}
          style={{
            background: 'rgba(93,209,160,.06)',
            border: '1px solid rgba(93,209,160,.3)',
            color: BP.solution,
            padding: '12px 20px',
            cursor: 'pointer',
            fontFamily: BP.title,
            fontWeight: '600',
            fontSize: '14px',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          ▶ DÉMO VOITURE AUTONOME
        </motion.button>
      </motion.div>
    </div>
  )
}
