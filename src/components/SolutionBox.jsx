import { motion } from 'framer-motion'

const BP = {
  solution: '#5dd1a0',
  mono:     'IBM Plex Mono, monospace',
  title:    'Saira Condensed, sans-serif',
  text:     '#dce8fb',
}

export default function SolutionBox({ title = 'LA SOLUTION', children }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45, delay: 0.1 }}
      style={{
        border: `1px solid rgba(93,209,160,.35)`,
        background: 'rgba(93,209,160,.04)',
        padding: '16px 20px',
        marginBottom: '20px',
        position: 'relative',
      }}
    >
      {/* corner marks */}
      <span style={{ position:'absolute', top:0, left:0, color:'rgba(93,209,160,.5)', fontSize:'10px', lineHeight:1 }}>┌</span>
      <span style={{ position:'absolute', bottom:0, right:0, color:'rgba(93,209,160,.5)', fontSize:'10px', lineHeight:1 }}>┘</span>

      {/* FIG label */}
      <div style={{
        fontFamily: BP.mono,
        fontSize: '7px',
        color: 'rgba(93,209,160,.6)',
        letterSpacing: '0.12em',
        marginBottom: '6px',
        textTransform: 'uppercase',
      }}>
        FIG. B — SOLUTION
      </div>

      {/* Title */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '10px',
        borderBottom: '1px dashed rgba(93,209,160,.2)',
        paddingBottom: '8px',
      }}>
        <svg width="14" height="14" viewBox="0 0 14 14">
          <circle cx="7" cy="7" r="5.5" fill="none" stroke="#5dd1a0" strokeWidth="1.2"/>
          <polyline points="4,7 6.5,9.5 10,5" fill="none" stroke="#5dd1a0" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span style={{
          color: BP.solution,
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
