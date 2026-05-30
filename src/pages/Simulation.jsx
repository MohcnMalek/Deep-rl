import { motion } from 'framer-motion'
import ProgressMap from '../components/ProgressMap'
import SelfDrivingSim from '../components/SelfDrivingSim'

const BP = {
  surface: '#0d2b50',
  border:  'rgba(188,214,255,.18)',
  text:    '#dce8fb',
  muted:   '#7fa3cf',
  mono:    'IBM Plex Mono, monospace',
  title:   'Saira Condensed, sans-serif',
  cyan:    '#7ecfff',
}

export default function Simulation() {
  return (
    <div style={{ padding: '0 0 100px' }}>
      <ProgressMap currentId={null} compact />

      <div style={{ padding: '28px 36px', maxWidth: '980px' }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>

          {/* Header */}
          <div style={{ fontFamily: BP.mono, fontSize: '8px', color: BP.muted, letterSpacing: '0.12em', marginBottom: '6px', textTransform: 'uppercase' }}>
            ÉTAPE 08 — SIMULATION INTERACTIVE
          </div>
          <h1 style={{
            fontFamily: BP.title,
            fontWeight: '800',
            fontSize: '36px',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            margin: '0 0 8px',
            color: BP.text,
          }}>
            VOITURE AUTONOME —<br/>
            <span style={{ color: BP.cyan }}>APPRENTISSAGE EN DIRECT</span>
          </h1>

          {/* Dimension line */}
          <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'20px' }}>
            <div style={{ height:'1px', width:'24px', background: BP.cyan, opacity:0.4 }} />
            <span style={{ fontFamily: BP.mono, fontSize:'9px', color: BP.muted, letterSpacing:'0.1em' }}>
              Q-LEARNING TABULAIRE · γ=0.95 · α=0.20 · ε-GREEDY DÉCROISSANT
            </span>
            <div style={{ height:'1px', flex:1, background:`linear-gradient(90deg,rgba(126,207,255,.3),transparent)` }} />
          </div>

          <SelfDrivingSim />

        </motion.div>
      </div>
    </div>
  )
}
