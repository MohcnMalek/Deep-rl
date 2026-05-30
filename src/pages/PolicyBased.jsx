import { motion } from 'framer-motion'
import ProgressMap from '../components/ProgressMap'
import ProblemBox from '../components/ProblemBox'
import SolutionBox from '../components/SolutionBox'
import NextProblemBox from '../components/NextProblemBox'

const BP = {
  surface: '#0d2b50', border: 'rgba(188,214,255,.18)',
  text: '#dce8fb', muted: '#7fa3cf', violet: '#b39dff',
  mono: 'IBM Plex Mono, monospace', title: 'Saira Condensed, sans-serif',
}

export default function PolicyBased() {
  return (
    <div style={{ padding: '0 0 100px' }}>
      <ProgressMap currentId="policy" compact />

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ padding: '28px 36px', maxWidth: '900px' }}>
        <div style={{ fontFamily: BP.mono, fontSize: '8px', color: BP.violet, letterSpacing: '0.12em', marginBottom: '6px', textTransform: 'uppercase' }}>
          ÉTAPE 04 — POLICY-BASED
        </div>
        <h1 style={{ fontFamily: BP.title, fontWeight: '800', fontSize: '36px', letterSpacing: '0.06em', textTransform: 'uppercase', margin: '0 0 6px', color: BP.text }}>
          MÉTHODES POLICY-BASED
        </h1>
        <p style={{ fontFamily: BP.mono, color: BP.muted, fontSize: '12px', lineHeight: '1.8', marginBottom: '28px' }}>
          Apprendre directement la politique — plus de Q-table, ni de réseau de valeurs.
        </p>

        <ProblemBox>
          <strong style={{ color: '#dce8fb' }}>DQN ne gère que des actions discrètes.</strong>{' '}
          Pour des actions continues (contrôle robotique, conduite autonome, trading), calculer{' '}
          <code style={{ background: 'rgba(255,122,69,.1)', padding: '2px 4px', color: '#ff7a45' }}>max Q(s', a')</code>{' '}
          sur un espace infini est impossible.
          <br /><br />
          Pour une voiture autonome : le <strong style={{ color: '#dce8fb' }}>volant</strong> a un angle continu dans [-180°, +180°],
          l'<strong style={{ color: '#dce8fb' }}>accélération</strong> est continue dans [0, 1]. DQN ne peut pas gérer ça.
        </ProblemBox>

        <SolutionBox title="APPRENDRE DIRECTEMENT π(a|s)">
          <p style={{ marginBottom: '12px' }}>
            On paramétrise la politique par un réseau θ et on maximise l'espérance de récompense
            cumulée par gradient ascent :
          </p>
          <pre style={{ background: '#071c36', border: '1px solid rgba(179,157,255,.2)', padding: '14px', color: BP.violet, fontSize: '12px', marginBottom: '14px', overflowX: 'auto', fontFamily: BP.mono }}>
{`# Objectif : maximiser J(θ) = E[Σ γᵗ rₜ]

# Théorème du gradient de politique (REINFORCE) :
∇θ J(θ) = E[ ∇θ log π(a|s; θ) · G_t ]
                           ↑
                retour cumulé de l'épisode

# Mise à jour :
θ ← θ + α · ∇θ J(θ)`}
          </pre>

          {/* Comparison table */}
          <div style={{ fontFamily: BP.mono, fontSize: '8px', color: BP.muted, letterSpacing: '0.1em', marginBottom: '8px', textTransform: 'uppercase' }}>
            FIG. 1 — COMPARAISON VALUE-BASED vs POLICY-BASED
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: '11px', fontFamily: BP.mono }}>
              <thead>
                <tr>
                  <th style={{ padding: '8px 14px', border: '1px solid rgba(188,214,255,.15)', background: BP.surface, color: BP.muted, textAlign: 'left', letterSpacing: '0.08em' }}>CRITÈRE</th>
                  <th style={{ padding: '8px 14px', border: '1px solid rgba(188,214,255,.15)', background: BP.surface, color: '#7ecfff', textAlign: 'center', letterSpacing: '0.08em' }}>VALUE-BASED (DQN)</th>
                  <th style={{ padding: '8px 14px', border: '1px solid rgba(188,214,255,.15)', background: BP.surface, color: BP.violet, textAlign: 'center', letterSpacing: '0.08em' }}>POLICY-BASED</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Ce qu\'on apprend', 'Q(s,a)', 'π(a|s)'],
                  ['Actions continues', '✗', '✓'],
                  ['Politique stochastique', '✗ (déterministe)', '✓'],
                  ['Stabilité', 'Moyenne (instable)', 'Bonne'],
                  ['Variance du gradient', '—', 'HAUTE ⚠'],
                ].map(([c, v, p], i) => (
                  <tr key={i}>
                    <td style={{ padding: '7px 14px', border: '1px solid rgba(188,214,255,.12)', background: i % 2 === 0 ? '#071c36' : BP.surface, color: BP.muted }}>{c}</td>
                    <td style={{ padding: '7px 14px', border: '1px solid rgba(188,214,255,.12)', background: i % 2 === 0 ? '#071c36' : BP.surface, color: '#7ecfff', textAlign: 'center' }}>{v}</td>
                    <td style={{ padding: '7px 14px', border: '1px solid rgba(188,214,255,.12)', background: i % 2 === 0 ? '#071c36' : BP.surface, color: BP.violet, textAlign: 'center' }}>{p}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SolutionBox>

        <div style={{ background: BP.surface, border: `1px solid ${BP.border}`, padding: '16px 20px', marginBottom: '24px', position: 'relative' }}>
          <span style={{ position:'absolute', top:0, left:0, color:'rgba(188,214,255,.4)', fontSize:'10px' }}>┌</span>
          <span style={{ position:'absolute', bottom:0, right:0, color:'rgba(188,214,255,.4)', fontSize:'10px' }}>┘</span>
          <div style={{ fontFamily: BP.mono, fontSize: '8px', color: BP.muted, letterSpacing: '0.12em', marginBottom: '8px', textTransform: 'uppercase' }}>IDÉE CLÉ</div>
          <p style={{ fontFamily: BP.mono, color: BP.text, lineHeight: '1.75', fontSize: '12px' }}>
            REINFORCE est simple et fonctionne en théorie, mais en pratique{' '}
            <strong style={{ color: BP.violet }}>G_t varie énormément d'un épisode à l'autre</strong>.
            Le gradient estimé est bruité — l'apprentissage est lent et peu fiable.
            On a besoin d'une baseline pour réduire cette variance.
          </p>
        </div>

        <NextProblemBox nextPath="/actor-critic" nextLabel="ACTOR-CRITIC — ÉTAPE 05">
          <strong style={{ color: '#dce8fb' }}>Forte variance du gradient de politique.</strong>{' '}
          Estimer G_t en attendant la fin d'un épisode entier introduit beaucoup de bruit.
          Deux épisodes identiques jusqu'à l'avant-dernière action peuvent donner des retours
          très différents selon le hasard de la dernière action.
          <br /><br />
          <span style={{ color: '#ffa26b' }}>→ Il faut une évaluation en temps réel pour réduire la variance : le Critic.</span>
        </NextProblemBox>
      </motion.div>
    </div>
  )
}
