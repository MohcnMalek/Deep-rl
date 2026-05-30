import { motion } from 'framer-motion'
import ProgressMap from '../components/ProgressMap'
import ProblemBox from '../components/ProblemBox'
import SolutionBox from '../components/SolutionBox'
import NextProblemBox from '../components/NextProblemBox'

const BP = {
  surface: '#0d2b50', border: 'rgba(188,214,255,.18)',
  text: '#dce8fb', muted: '#7fa3cf', accent: '#ff9f6b',
  mono: 'IBM Plex Mono, monospace', title: 'Saira Condensed, sans-serif',
}

const AC_BOXES = [
  { label: 'ACTOR\nπ(a|s; θ)', sub: 'Choisit l\'action', color: '#b39dff' },
  { label: 'ENVIRON.\nr, s\'', sub: 'Retourne état', color: 'rgba(188,214,255,.4)' },
  { label: 'CRITIC\nV(s; w)', sub: 'Évalue l\'état', color: '#ff9f6b' },
]

export default function ActorCritic() {
  return (
    <div style={{ padding: '0 0 100px' }}>
      <ProgressMap currentId="actor-critic" compact />

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ padding: '28px 36px', maxWidth: '900px' }}>
        <div style={{ fontFamily: BP.mono, fontSize: '8px', color: BP.accent, letterSpacing: '0.12em', marginBottom: '6px', textTransform: 'uppercase' }}>
          ÉTAPE 05 — HYBRIDE
        </div>
        <h1 style={{ fontFamily: BP.title, fontWeight: '800', fontSize: '36px', letterSpacing: '0.06em', textTransform: 'uppercase', margin: '0 0 6px', color: BP.text }}>
          ACTOR-CRITIC
        </h1>
        <p style={{ fontFamily: BP.mono, color: BP.muted, fontSize: '12px', lineHeight: '1.8', marginBottom: '28px' }}>
          L'Actor choisit l'action. Le Critic évalue. Ensemble, ils réduisent la variance.
        </p>

        <ProblemBox>
          <strong style={{ color: '#dce8fb' }}>Le policy gradient a une forte variance.</strong>{' '}
          Estimer le retour G_t à partir d'un épisode complet est bruité et lent. L'apprentissage
          oscille et converge difficilement, surtout dans des environnements à longue durée.
        </ProblemBox>

        <SolutionBox title="SÉPARER QUI DÉCIDE DE QUI ÉVALUE">
          <p style={{ marginBottom: '14px' }}>
            Remplacer le retour bruité G_t par une{' '}
            <strong style={{ color: '#5dd1a0' }}>fonction d'avantage A(s,a)</strong> estimée
            en temps réel par un réseau Critic.
          </p>

          {/* A-C diagram */}
          <div style={{ fontFamily: BP.mono, fontSize: '8px', color: BP.muted, letterSpacing: '0.1em', marginBottom: '10px', textTransform: 'uppercase' }}>
            FIG. 1 — ARCHITECTURE ACTOR-CRITIC
          </div>
          <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', marginBottom: '16px', flexWrap: 'wrap' }}>
            {AC_BOXES.map((box, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{
                  background: `${box.color}10`,
                  border: `1px solid ${box.color}44`,
                  padding: '12px 16px',
                  textAlign: 'center',
                  minWidth: '120px',
                }}>
                  <pre style={{ color: box.color, fontFamily: BP.mono, fontSize: '11px', margin: '0 0 4px', whiteSpace: 'pre-wrap', letterSpacing: '0.04em' }}>
                    {box.label}
                  </pre>
                  <div style={{ color: BP.muted, fontSize: '9px', letterSpacing: '0.06em' }}>{box.sub}</div>
                </div>
                {i < AC_BOXES.length - 1 && (
                  <svg width="20" height="14" style={{ flexShrink:0 }}>
                    <line x1="0" y1="7" x2="14" y2="7" stroke="rgba(188,214,255,.25)" strokeWidth="1" strokeDasharray="2 2"/>
                    <polyline points="11,4 14,7 11,10" fill="none" stroke="rgba(188,214,255,.25)" strokeWidth="1"/>
                  </svg>
                )}
              </div>
            ))}
          </div>

          <pre style={{ background: '#071c36', border: '1px solid rgba(255,159,107,.2)', padding: '14px', color: BP.accent, fontSize: '12px', overflowX: 'auto', fontFamily: BP.mono }}>
{`# Avantage A(s,a) = Q(s,a) - V(s)
#   en pratique : A ≈ r + γ·V(s') - V(s)   ← TD-error

# Mise à jour Actor (maximise l'avantage) :
∇θ J = E[ ∇θ log π(a|s; θ) · A(s,a) ]

# Mise à jour Critic (minimise l'erreur de valeur) :
L(w) = (r + γ·V(s'; w) - V(s; w))²`}
          </pre>
        </SolutionBox>

        <div style={{ background: BP.surface, border: `1px solid ${BP.border}`, padding: '16px 20px', marginBottom: '24px', position: 'relative' }}>
          <span style={{ position:'absolute', top:0, left:0, color:'rgba(188,214,255,.4)', fontSize:'10px' }}>┌</span>
          <span style={{ position:'absolute', bottom:0, right:0, color:'rgba(188,214,255,.4)', fontSize:'10px' }}>┘</span>
          <div style={{ fontFamily: BP.mono, fontSize: '8px', color: BP.muted, letterSpacing: '0.12em', marginBottom: '8px', textTransform: 'uppercase' }}>IDÉE CLÉ</div>
          <p style={{ fontFamily: BP.mono, color: BP.text, lineHeight: '1.75', fontSize: '12px' }}>
            Le Critic fournit un signal d'erreur <strong style={{ color: BP.accent }}>à chaque pas</strong>,
            pas seulement en fin d'épisode. Cela réduit drastiquement la variance. L'Actor et le Critic
            partagent parfois les couches basses du réseau, mais ont des têtes de sortie séparées —
            un seul réseau, deux objectifs.
          </p>
        </div>

        <NextProblemBox nextPath="/ppo" nextLabel="PPO — ÉTAPE FINALE ✓">
          <strong style={{ color: '#dce8fb' }}>Les mises à jour peuvent être trop brutales.</strong>{' '}
          Si le gradient d'Actor-Critic fait un grand pas, la nouvelle politique peut être très
          différente de l'ancienne. Sans contrainte sur la distance entre les deux politiques,
          l'apprentissage peut s'effondrer — on détruit irréversiblement une bonne politique.
          <br /><br />
          <span style={{ color: '#ffa26b' }}>→ Il faut borner la taille des mises à jour. C'est l'idée du clipping PPO.</span>
        </NextProblemBox>
      </motion.div>
    </div>
  )
}
