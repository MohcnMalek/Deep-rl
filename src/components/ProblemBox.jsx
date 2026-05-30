import { motion } from 'framer-motion'

const BP = {
  problem: '#ff7a45',
  mono:    'IBM Plex Mono, monospace',
  title:   'Saira Condensed, sans-serif',
  text:    '#dce8fb',
}

export default function ProblemBox({ title = 'LE PROBLÈME PRÉCÉDENT', children }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45 }}
      style={{
        border: `1px solid rgba(255,122,69,.35)`,
        background: 'rgba(255,122,69,.05)',
        padding: '16px 20px 16px 20px',
        marginBottom: '20px',
        position: 'relative',
      }}
    >
      {/* corner marks */}
      <span style={{ position:'absolute', top:0, left:0, color:'rgba(255,122,69,.5)', fontSize:'10px', lineHeight:1 }}>┌</span>
      <span style={{ position:'absolute', bottom:0, right:0, color:'rgba(255,122,69,.5)', fontSize:'10px', lineHeight:1 }}>┘</span>

      {/* FIG label */}
      <div style={{
        fontFamily: BP.mono,
        fontSize: '7px',
        color: 'rgba(255,122,69,.6)',
        letterSpacing: '0.12em',
        marginBottom: '6px',
        textTransform: 'uppercase',
      }}>
        FIG. A — PROBLÈME
      </div>

      {/* Title */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '10px',
        borderBottom: '1px dashed rgba(255,122,69,.2)',
        paddingBottom: '8px',
      }}>
        <svg width="14" height="14" viewBox="0 0 14 14">
          <polygon points="7,1 13,13 1,13" fill="none" stroke="#ff7a45" strokeWidth="1.2"/>
          <line x1="7" y1="5" x2="7" y2="9" stroke="#ff7a45" strokeWidth="1.2"/>
          <circle cx="7" cy="11" r="0.8" fill="#ff7a45"/>
        </svg>
        <span style={{
          color: BP.problem,
          fontFamily: BP.title,
          fontWeight: '700',
          fontSize: '13px',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
        }}>
          {title}
        </span>
      </div>

      <div style={{
        color: BP.text,
        lineHeight: '1.75',
        fontSize: '13px',
        fontFamily: BP.mono,
      }}>
        {children}
      </div>
    </motion.div>
  )
}
