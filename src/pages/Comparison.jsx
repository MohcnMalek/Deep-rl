import { motion } from 'framer-motion'

const BP = {
  surface: '#0d2b50', border: 'rgba(188,214,255,.18)',
  text: '#dce8fb', muted: '#7fa3cf',
  mono: 'IBM Plex Mono, monospace', title: 'Saira Condensed, sans-serif',
}

const ALGOS = [
  { name: 'Q-LEARNING',    family: 'VALUE-BASED',  color: '#7ecfff',  continuous: '✗', stochastic: '✗', variance: 'BASSE',     stability: '★★☆', sample: '★★☆', usecase: 'GridWorld, jeux discrets' },
  { name: 'DQN',           family: 'VALUE-BASED',  color: '#7ecfff',  continuous: '✗', stochastic: '✗', variance: 'BASSE',     stability: '★★★', sample: '★★☆', usecase: 'Atari, jeux pixels' },
  { name: 'REPLAY+TARGET', family: 'VALUE-BASED',  color: '#7ecfff',  continuous: '✗', stochastic: '✗', variance: 'BASSE',     stability: '★★★', sample: '★★★', usecase: 'DQN amélioré' },
  { name: 'REINFORCE',     family: 'POLICY-BASED', color: '#b39dff',  continuous: '✓', stochastic: '✓', variance: 'TRÈS HAUTE',stability: '★☆☆', sample: '★☆☆', usecase: 'Proof-of-concept' },
  { name: 'ACTOR-CRITIC',  family: 'HYBRIDE',      color: '#ff9f6b',  continuous: '✓', stochastic: '✓', variance: 'MOYENNE',   stability: '★★☆', sample: '★★☆', usecase: 'Robotique, continu' },
  { name: 'PPO ✓',         family: 'HYBRIDE',      color: '#5dd1a0',  continuous: '✓', stochastic: '✓', variance: 'BASSE',     stability: '★★★', sample: '★★★', usecase: 'ChatGPT, robotique' },
]

const COLS = [
  { key: 'name', label: 'ALGORITHME' },
  { key: 'family', label: 'FAMILLE' },
  { key: 'continuous', label: 'CONTINU' },
  { key: 'stochastic', label: 'STOCH.' },
  { key: 'variance', label: 'VARIANCE' },
  { key: 'stability', label: 'STABILITÉ' },
  { key: 'sample', label: 'SAMPLE-EFF.' },
  { key: 'usecase', label: 'CAS D\'USAGE' },
]

export default function Comparison() {
  return (
    <div style={{ padding: '0 0 100px' }}>
      <div style={{ padding: '28px 36px', maxWidth: '1020px' }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>

          <div style={{ fontFamily: BP.mono, fontSize: '8px', color: BP.muted, letterSpacing: '0.12em', marginBottom: '6px', textTransform: 'uppercase' }}>
            ÉTAPE 07 — FICHE TECHNIQUE
          </div>
          <h1 style={{ fontFamily: BP.title, fontWeight: '800', fontSize: '36px', letterSpacing: '0.06em', textTransform: 'uppercase', margin: '0 0 20px', color: BP.text }}>
            COMPARAISON DES ALGORITHMES
          </h1>

          {/* Legend */}
          <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
            {[
              { label: 'VALUE-BASED', color: '#7ecfff' },
              { label: 'POLICY-BASED', color: '#b39dff' },
              { label: 'HYBRIDE', color: '#ff9f6b' },
            ].map(f => (
              <div key={f.label} style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                <div style={{ width: '8px', height: '8px', background: f.color, opacity: 0.7 }} />
                <span style={{ fontFamily: BP.mono, color: BP.muted, fontSize: '9px', letterSpacing: '0.1em' }}>{f.label}</span>
              </div>
            ))}
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto', border: `1px solid ${BP.border}`, position: 'relative', marginBottom: '28px' }}>
            <span style={{ position:'absolute', top:0, left:0, color:'rgba(188,214,255,.4)', fontSize:'10px', zIndex:2 }}>┌</span>
            <span style={{ position:'absolute', bottom:0, right:0, color:'rgba(188,214,255,.4)', fontSize:'10px', zIndex:2 }}>┘</span>
            <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: '11px', fontFamily: BP.mono }}>
              <thead>
                <tr>
                  {COLS.map(c => (
                    <th key={c.key} style={{
                      padding: '9px 12px',
                      border: '1px solid rgba(188,214,255,.12)',
                      background: BP.surface,
                      color: BP.muted,
                      textAlign: 'left',
                      letterSpacing: '0.1em',
                      whiteSpace: 'nowrap',
                      fontWeight: '600',
                    }}>
                      {c.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ALGOS.map((algo, i) => (
                  <motion.tr
                    key={algo.name}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 + 0.2 }}
                    style={{ background: i % 2 === 0 ? '#071c36' : BP.surface }}
                  >
                    {COLS.map(c => (
                      <td key={c.key} style={{
                        padding: '8px 12px',
                        border: '1px solid rgba(188,214,255,.09)',
                        color: c.key === 'name'
                          ? algo.color
                          : c.key === 'family'
                          ? `${algo.color}bb`
                          : c.key === 'continuous' || c.key === 'stochastic'
                          ? algo[c.key] === '✓' ? '#5dd1a0' : 'rgba(255,122,69,.7)'
                          : c.key === 'variance'
                          ? algo[c.key].includes('TRÈS') ? '#ff7a45' : algo[c.key] === 'MOYENNE' ? '#ffa26b' : '#5dd1a0'
                          : BP.muted,
                        fontWeight: c.key === 'name' ? '600' : '400',
                        whiteSpace: c.key === 'usecase' ? 'normal' : 'nowrap',
                        letterSpacing: '0.04em',
                      }}>
                        {algo[c.key]}
                      </td>
                    ))}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '12px' }}>
            {[
              { title: 'VALUE-BASED', color: '#7ecfff', text: 'Efficaces et stables sur des espaces discrets. Limités aux actions discrètes.' },
              { title: 'POLICY-BASED', color: '#b39dff', text: 'Gèrent le continu et les politiques stochastiques, mais souffrent de variance élevée.' },
              { title: 'HYBRIDE (PPO)', color: '#5dd1a0', text: 'Meilleur des deux mondes : continu, stable, faible variance. Standard industriel.' },
            ].map(card => (
              <div key={card.title} style={{
                background: `${card.color}08`,
                border: `1px solid ${card.color}33`,
                padding: '14px 16px',
                position: 'relative',
              }}>
                <span style={{ position:'absolute', top:0, left:0, color:`${card.color}44`, fontSize:'10px' }}>┌</span>
                <span style={{ position:'absolute', bottom:0, right:0, color:`${card.color}44`, fontSize:'10px' }}>┘</span>
                <div style={{ fontFamily: BP.title, fontWeight: '700', fontSize: '14px', letterSpacing: '0.08em', color: card.color, marginBottom: '6px', textTransform: 'uppercase' }}>
                  {card.title}
                </div>
                <div style={{ fontFamily: BP.mono, color: BP.muted, fontSize: '11px', lineHeight: '1.7' }}>{card.text}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
