import { motion } from 'framer-motion'
import ProgressMap from '../components/ProgressMap'
import SolutionBox from '../components/SolutionBox'
import NextProblemBox from '../components/NextProblemBox'

const BP = {
  surface: '#0d2b50', border: 'rgba(188,214,255,.18)',
  text: '#dce8fb', muted: '#7fa3cf', cyan: '#7ecfff',
  mono: 'IBM Plex Mono, monospace', title: 'Saira Condensed, sans-serif',
}

const QTABLE = [
  ['ÉTAT \\ ACTION', '←', '→', '↑', '↓'],
  ['s₀', '0.0', '0.8', '0.1', '0.2'],
  ['s₁', '0.3', '0.1', '0.9', '0.0'],
  ['s₂', '0.5', '0.0', '0.2', '0.7'],
  ['s₃', '0.0', '0.6', '0.0', '0.4'],
]

export default function QLearning() {
  return (
    <div style={{ padding: '0 0 100px' }}>
      <ProgressMap currentId="q-learning" compact />

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ padding: '28px 36px', maxWidth: '900px' }}>
        <div style={{ fontFamily: BP.mono, fontSize: '8px', color: BP.cyan, letterSpacing: '0.12em', marginBottom: '6px', textTransform: 'uppercase' }}>
          ÉTAPE 01 — VALUE-BASED
        </div>
        <h1 style={{ fontFamily: BP.title, fontWeight: '800', fontSize: '36px', letterSpacing: '0.06em', textTransform: 'uppercase', margin: '0 0 6px', color: BP.text }}>
          Q-LEARNING &amp; Q-TABLE
        </h1>
        <p style={{ fontFamily: BP.mono, color: BP.muted, fontSize: '12px', lineHeight: '1.8', marginBottom: '28px' }}>
          Le point de départ — apprendre à agir en stockant la valeur de chaque action dans chaque état.
        </p>

        <SolutionBox title="LA FONDATION : LA Q-TABLE">
          <p style={{ marginBottom: '12px' }}>
            Le Q-Learning maintient une table{' '}
            <code style={{ background: 'rgba(126,207,255,.1)', padding: '2px 6px', color: BP.cyan }}>Q(s, a)</code>{' '}
            qui associe à chaque paire (état, action) le gain futur espéré.
          </p>
          <p style={{ marginBottom: '14px' }}>À chaque pas, mise à jour via la règle de Bellman :</p>
          <pre style={{ background: '#071c36', border: '1px solid rgba(188,214,255,.15)', padding: '14px', color: BP.cyan, fontSize: '12px', overflowX: 'auto', fontFamily: BP.mono }}>
{`Q(s, a) ← Q(s, a) + α · [r + γ · max Q(s', a') − Q(s, a)]
                              ↑                    ↑
                          récompense          valeur future`}
          </pre>
        </SolutionBox>

        {/* Q-Table visual */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} style={{ marginBottom: '24px' }}>
          <div style={{ fontFamily: BP.mono, fontSize: '8px', color: BP.muted, letterSpacing: '0.1em', marginBottom: '10px', textTransform: 'uppercase' }}>
            EXEMPLE — GRIDWORLD 2×2 :
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', fontFamily: BP.mono, fontSize: '12px' }}>
              {QTABLE.map((row, ri) => (
                <tr key={ri}>
                  {row.map((cell, ci) => (
                    <td key={ci} style={{
                      padding: '7px 14px',
                      border: '1px solid rgba(188,214,255,.15)',
                      background: ri === 0 || ci === 0 ? BP.surface : '#071c36',
                      color: ri === 0 || ci === 0 ? BP.muted : BP.cyan,
                      textAlign: 'center',
                      fontWeight: ri === 0 || ci === 0 ? '600' : '400',
                      letterSpacing: '0.04em',
                    }}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </table>
          </div>
        </motion.div>

        {/* Key idea */}
        <div style={{ background: BP.surface, border: `1px solid ${BP.border}`, padding: '16px 20px', marginBottom: '24px', position: 'relative' }}>
          <span style={{ position:'absolute', top:0, left:0, color:'rgba(188,214,255,.4)', fontSize:'10px' }}>┌</span>
          <span style={{ position:'absolute', bottom:0, right:0, color:'rgba(188,214,255,.4)', fontSize:'10px' }}>┘</span>
          <div style={{ fontFamily: BP.mono, fontSize: '8px', color: BP.muted, letterSpacing: '0.12em', marginBottom: '8px', textTransform: 'uppercase' }}>IDÉE CLÉ</div>
          <p style={{ fontFamily: BP.mono, color: BP.text, lineHeight: '1.75', fontSize: '12px' }}>
            Q-Learning converge vers la politique optimale sans modèle de l'environnement (model-free).
            L'agent explore, accumule des expériences, et améliore ses estimations Q.
            Le paramètre <strong style={{ color: BP.cyan }}>ε-greedy</strong> équilibre
            exploration (essayer du nouveau) et exploitation (utiliser ce qui marche).
          </p>
        </div>

        <NextProblemBox nextPath="/dqn" nextLabel="DQN — ÉTAPE 02">
          <strong style={{ color: '#dce8fb' }}>La Q-Table devient trop grande</strong> quand il y a beaucoup d'états.
          Pour une voiture autonome avec position, vitesse, angle, capteurs…
          le nombre d'états possibles dépasse plusieurs millions. Impossible à stocker dans un tableau.
          <br /><br />
          <span style={{ color: '#ffa26b' }}>→ Il faut approximer Q(s,a), pas la stocker.</span>
        </NextProblemBox>
      </motion.div>
    </div>
  )
}
