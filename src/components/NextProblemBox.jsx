import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const BP = {
  accent: '#ffa26b',
  mono:   'IBM Plex Mono, monospace',
  title:  'Saira Condensed, sans-serif',
  text:   '#dce8fb',
}

export default function NextProblemBox({ children, nextLabel, nextPath }) {
  const navigate = useNavigate()

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.2 }}
      style={{
        border: `1px solid rgba(255,162,107,.35)`,
        background: 'rgba(255,162,107,.04)',
        padding: '16px 20px',
        marginTop: '28px',
        position: 'relative',
      }}
    >
      <span style={{ position:'absolute', top:0, left:0, color:'rgba(255,162,107,.5)', fontSize:'10px', lineHeight:1 }}>┌</span>
      <span style={{ position:'absolute', bottom:0, right:0, color:'rgba(255,162,107,.5)', fontSize:'10px', lineHeight:1 }}>┘</span>

      <div style={{
        fontFamily: BP.mono,
        fontSize: '7px',
        color: 'rgba(255,162,107,.6)',
        letterSpacing: '0.12em',
        marginBottom: '6px',
        textTransform: 'uppercase',
      }}>
        FIG. C — NOUVEAU PROBLÈME
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '10px',
        borderBottom: '1px dashed rgba(255,162,107,.2)',
        paddingBottom: '8px',
      }}>
        <svg width="14" height="14" viewBox="0 0 14 14">
          <polyline points="3,7 7,3 11,7" fill="none" stroke="#ffa26b" strokeWidth="1.2" strokeLinecap="round"/>
          <line x1="7" y1="3" x2="7" y2="11" stroke="#ffa26b" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
        <span style={{
          color: BP.accent,
          fontFamily: BP.title,
          fontWeight: '700',
          fontSize: '13px',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
        }}>
          MAIS… LE NOUVEAU PROBLÈME
        </span>
      </div>

      <div style={{
        color: BP.text,
        lineHeight: '1.75',
        fontSize: '13px',
        fontFamily: BP.mono,
        marginBottom: nextPath ? '16px' : 0,
      }}>
        {children}
      </div>

      {nextPath && (
        <motion.button
          whileHover={{ scale: 1.03, x: 4 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate(nextPath)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255,162,107,.08)',
            border: '1px solid rgba(255,162,107,.4)',
            color: BP.accent,
            padding: '8px 18px',
            cursor: 'pointer',
            fontFamily: BP.title,
            fontWeight: '700',
            fontSize: '13px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}
        >
          {nextLabel || 'ÉTAPE SUIVANTE'}
          <svg width="14" height="14" viewBox="0 0 14 14">
            <line x1="2" y1="7" x2="12" y2="7" stroke="#ffa26b" strokeWidth="1.3"/>
            <polyline points="8,3 12,7 8,11" fill="none" stroke="#ffa26b" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
        </motion.button>
      )}
    </motion.div>
  )
}
