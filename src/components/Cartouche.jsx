import { useLocation } from 'react-router-dom'

const BP = {
  bg:      '#0a2342',
  surface: '#0d2b50',
  line:    'rgba(188,214,255,.3)',
  text:    '#dce8fb',
  muted:   '#7fa3cf',
  mono:    'IBM Plex Mono, monospace',
}

export default function Cartouche({ routeMeta }) {
  const { hash } = useLocation()
  const path = hash.replace('#', '') || '/'
  const meta = routeMeta[path] || { title: 'DEEP RL', plate: '00' }
  const today = new Date().toISOString().slice(0, 10)

  return (
    <div style={{
      position: 'fixed',
      bottom: '16px',
      right: '20px',
      zIndex: 50,
      background: BP.surface,
      border: `1px solid ${BP.line}`,
      width: '220px',
      fontFamily: BP.mono,
      fontSize: '9px',
      color: BP.muted,
      userSelect: 'none',
      /* corner marks */
      boxShadow: 'inset 0 0 0 1px rgba(188,214,255,.06)',
    }}>
      {/* top hairline */}
      <div style={{ height: '1px', background: BP.line, opacity: 0.4 }} />

      {/* Header row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        borderBottom: `1px solid ${BP.line}`,
        opacity: 0.7,
      }}>
        <div style={{ padding: '3px 6px', borderRight: `1px solid ${BP.line}` }}>
          PROJET
        </div>
        <div style={{ padding: '3px 6px' }}>DEEP REINFORCEMENT LEARNING</div>
      </div>

      {/* Title row */}
      <div style={{
        padding: '5px 6px',
        borderBottom: `1px solid ${BP.line}`,
        color: BP.text,
        fontSize: '12px',
        fontWeight: '600',
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
      }}>
        {meta.title}
      </div>

      {/* Info rows */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        borderBottom: `1px solid ${BP.line}`,
      }}>
        <div style={{ padding: '3px 6px', borderRight: `1px solid ${BP.line}` }}>
          <div style={{ opacity: 0.5, marginBottom: '1px' }}>AUTEUR</div>
          <div style={{ color: BP.text }}>Mouhcine Malek</div>
        </div>
        <div style={{ padding: '3px 6px' }}>
          <div style={{ opacity: 0.5, marginBottom: '1px' }}>DATE</div>
          <div>{today}</div>
        </div>
      </div>

      {/* Plate number row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto',
      }}>
        <div style={{ padding: '3px 6px', borderRight: `1px solid ${BP.line}`, opacity: 0.6 }}>
          DEEP RL — PLANCHE {meta.plate}
        </div>
        <div style={{
          padding: '3px 8px',
          color: BP.text,
          fontWeight: '600',
          fontSize: '11px',
        }}>
          {meta.plate}
        </div>
      </div>
    </div>
  )
}
