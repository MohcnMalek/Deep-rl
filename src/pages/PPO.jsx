import { motion } from 'framer-motion'
import ProgressMap from '../components/ProgressMap'
import ProblemBox from '../components/ProblemBox'
import SolutionBox from '../components/SolutionBox'

const BP = {
  surface: '#0d2b50', border: 'rgba(188,214,255,.18)',
  text: '#dce8fb', muted: '#7fa3cf', solution: '#5dd1a0',
  problem: '#ff7a45', mono: 'IBM Plex Mono, monospace', title: 'Saira Condensed, sans-serif',
}

export default function PPO() {
  return (
    <div style={{ padding: '0 0 100px' }}>
      <ProgressMap currentId="ppo" compact />

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ padding: '28px 36px', maxWidth: '900px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
          <div style={{ fontFamily: BP.mono, fontSize: '8px', color: BP.solution, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            ÉTAPE 06 — ABOUTISSEMENT ✓
          </div>
          <svg width="14" height="14" viewBox="0 0 14 14">
            <polygon points="7,1 8.8,5.5 13.5,5.5 9.5,8.5 11,13 7,10 3,13 4.5,8.5 0.5,5.5 5.2,5.5" fill="#5dd1a0"/>
          </svg>
        </div>

        <h1 style={{ fontFamily: BP.title, fontWeight: '800', fontSize: '36px', letterSpacing: '0.06em', textTransform: 'uppercase', margin: '0 0 6px', color: BP.text }}>
          PROXIMAL POLICY OPTIMIZATION
        </h1>
        <p style={{ fontFamily: BP.mono, color: BP.muted, fontSize: '12px', lineHeight: '1.8', marginBottom: '28px' }}>
          Des petits pas sûrs grâce au clipping — l'algorithme de référence en 2024–2026.
        </p>

        <ProblemBox>
          <strong style={{ color: '#dce8fb' }}>Une mise à jour trop brutale peut détruire une bonne politique.</strong>{' '}
          Dans Actor-Critic classique, un grand pas de gradient peut emmener la politique loin de l'ancienne.
          Sans contrainte sur la distance entre les deux politiques, l'apprentissage peut s'effondrer.
        </ProblemBox>

        <SolutionBox title="LE CLIPPING : BORNER LE RATIO DE POLITIQUES">
          <p style={{ marginBottom: '12px' }}>
            PPO introduit un ratio{' '}
            <code style={{ background: 'rgba(93,209,160,.1)', padding: '2px 6px', color: BP.solution }}>
              r_t(θ) = π(a|s;θ) / π(a|s;θ_old)
            </code>{' '}
            et le borne avec un clip :
          </p>
          <pre style={{ background: '#071c36', border: '1px solid rgba(93,209,160,.2)', padding: '14px', color: BP.solution, fontSize: '12px', marginBottom: '14px', overflowX: 'auto', fontFamily: BP.mono }}>
{`r_t(θ) = π(a|s; θ) / π(a|s; θ_old)

L_CLIP(θ) = E[ min(
    r_t(θ) · A_t,
    clip(r_t(θ), 1-ε, 1+ε) · A_t
) ]

# ε typiquement = 0.2
# Si r_t > 1+ε ou r_t < 1-ε → gradient tronqué
# → le pas reste petit et sûr`}
          </pre>

          {/* Clip visualization in blueprint style */}
          <div style={{ background: '#071c36', border: '1px solid rgba(188,214,255,.12)', padding: '14px 16px', marginBottom: '10px', position: 'relative' }}>
            <span style={{ position:'absolute', top:0, left:0, color:'rgba(188,214,255,.35)', fontSize:'10px' }}>┌</span>
            <div style={{ fontFamily: BP.mono, fontSize: '8px', color: BP.muted, letterSpacing: '0.1em', marginBottom: '12px', textTransform: 'uppercase' }}>
              FIG. 1 — EFFET DU CLIPPING (A &gt; 0)
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '60px' }}>
              {Array.from({ length: 22 }, (_, i) => {
                const r = 0.4 + i * 0.1
                const clipped = Math.min(Math.max(r, 0.8), 1.2)
                const h = (clipped / 1.6) * 55
                const isClipped = r < 0.8 || r > 1.2
                return (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}px` }}
                    transition={{ delay: i * 0.025 }}
                    style={{
                      flex: 1,
                      background: isClipped ? 'rgba(255,122,69,.7)' : 'rgba(93,209,160,.7)',
                      alignSelf: 'flex-end',
                    }}
                  />
                )
              })}
            </div>
            {/* Tick marks */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px' }}>
              <span style={{ color: BP.problem, fontSize: '9px', fontFamily: BP.mono }}>r &lt; 1-ε COUPÉ</span>
              <span style={{ color: BP.solution, fontSize: '9px', fontFamily: BP.mono }}>ZONE SÛRE [1-ε, 1+ε]</span>
              <span style={{ color: BP.problem, fontSize: '9px', fontFamily: BP.mono }}>r &gt; 1+ε COUPÉ</span>
            </div>
          </div>
        </SolutionBox>

        <div style={{ background: BP.surface, border: `1px solid ${BP.border}`, padding: '16px 20px', marginBottom: '24px', position: 'relative' }}>
          <span style={{ position:'absolute', top:0, left:0, color:'rgba(188,214,255,.4)', fontSize:'10px' }}>┌</span>
          <span style={{ position:'absolute', bottom:0, right:0, color:'rgba(188,214,255,.4)', fontSize:'10px' }}>┘</span>
          <div style={{ fontFamily: BP.mono, fontSize: '8px', color: BP.muted, letterSpacing: '0.12em', marginBottom: '8px', textTransform: 'uppercase' }}>IDÉE CLÉ</div>
          <p style={{ fontFamily: BP.mono, color: BP.text, lineHeight: '1.75', fontSize: '12px' }}>
            PPO est simple à implémenter, stable, et fonctionne sur une vaste gamme de tâches.
            C'est pour ça que c'est l'algorithme de référence utilisé par OpenAI pour entraîner
            ChatGPT (via RLHF). Le clipping remplace des contraintes KL complexes par une
            simple troncature — élégant et efficace.
          </p>
        </div>

        {/* End-of-story summary */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{
            background: 'rgba(93,209,160,.05)',
            border: '1px solid rgba(93,209,160,.35)',
            padding: '24px 28px',
            textAlign: 'center',
            position: 'relative',
          }}
        >
          <span style={{ position:'absolute', top:0, left:0, color:'rgba(93,209,160,.5)', fontSize:'10px' }}>┌</span>
          <span style={{ position:'absolute', top:0, right:0, color:'rgba(93,209,160,.5)', fontSize:'10px' }}>┐</span>
          <span style={{ position:'absolute', bottom:0, left:0, color:'rgba(93,209,160,.5)', fontSize:'10px' }}>└</span>
          <span style={{ position:'absolute', bottom:0, right:0, color:'rgba(93,209,160,.5)', fontSize:'10px' }}>┘</span>

          <div style={{ fontFamily: BP.mono, fontSize: '8px', color: 'rgba(93,209,160,.6)', letterSpacing: '0.12em', marginBottom: '10px', textTransform: 'uppercase' }}>
            FIG. FINALE — HISTOIRE COMPLÈTE
          </div>
          <h2 style={{ fontFamily: BP.title, fontWeight: '800', fontSize: '20px', letterSpacing: '0.08em', textTransform: 'uppercase', color: BP.solution, margin: '0 0 14px' }}>
            DU PROBLÈME À LA SOLUTION ✓
          </h2>
          <p style={{ fontFamily: BP.mono, color: BP.muted, lineHeight: '2', fontSize: '11px', maxWidth: '520px', margin: '0 auto', letterSpacing: '0.03em' }}>
            Q-TABLE → <span style={{ color: BP.problem }}>TROP GRANDE</span> → DQN →{' '}
            <span style={{ color: BP.problem }}>INSTABLE</span> → REPLAY+TARGET →{' '}
            <span style={{ color: BP.problem }}>PAS DE CONTINU</span> → POLICY-BASED →{' '}
            <span style={{ color: BP.problem }}>VARIANCE</span> → ACTOR-CRITIC →{' '}
            <span style={{ color: BP.problem }}>TROP BRUTAL</span> → <span style={{ color: BP.solution, fontWeight: '600' }}>PPO ✓</span>
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}
