import { motion } from 'framer-motion'
import ProgressMap from '../components/ProgressMap'
import ProblemBox from '../components/ProblemBox'
import SolutionBox from '../components/SolutionBox'
import NextProblemBox from '../components/NextProblemBox'

const BP = {
  surface: '#0d2b50', border: 'rgba(188,214,255,.18)',
  text: '#dce8fb', muted: '#7fa3cf', cyan: '#7ecfff',
  mono: 'IBM Plex Mono, monospace', title: 'Saira Condensed, sans-serif',
}

const LAYERS = [
  { label: 'ÉTAT s', h: 60, color: '#7ecfff' },
  { label: 'COUCHE CACHÉE', h: 100, color: '#3a6fcc' },
  { label: 'COUCHE CACHÉE', h: 100, color: '#3a6fcc' },
  { label: 'Q(s,a) / ACTION', h: 80, color: '#7ecfff' },
]

export default function DQN() {
  return (
    <div style={{ padding: '0 0 100px' }}>
      <ProgressMap currentId="dqn" compact />

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ padding: '28px 36px', maxWidth: '900px' }}>
        <div style={{ fontFamily: BP.mono, fontSize: '8px', color: BP.cyan, letterSpacing: '0.12em', marginBottom: '6px', textTransform: 'uppercase' }}>
          ÉTAPE 02 — VALUE-BASED
        </div>
        <h1 style={{ fontFamily: BP.title, fontWeight: '800', fontSize: '36px', letterSpacing: '0.06em', textTransform: 'uppercase', margin: '0 0 6px', color: BP.text }}>
          DEEP Q-NETWORK (DQN)
        </h1>
        <p style={{ fontFamily: BP.mono, color: BP.muted, fontSize: '12px', lineHeight: '1.8', marginBottom: '28px' }}>
          Remplacer la Q-table par un réseau de neurones pour gérer des espaces d'états immenses.
        </p>

        <ProblemBox>
          <strong style={{ color: '#dce8fb' }}>La Q-table devient trop grande</strong> quand l'environnement a beaucoup d'états.
          Pour Atari (images 210×160 pixels), stocker Q(s,a) est impossible en mémoire.
          Il faut passer à une représentation paramétrique.
        </ProblemBox>

        <SolutionBox title="APPROXIMER Q AVEC UN RÉSEAU DE NEURONES">
          <p style={{ marginBottom: '12px' }}>DQN (Mnih et al., 2015) utilise un réseau θ pour approximer la fonction Q :</p>
          <pre style={{ background: '#071c36', border: '1px solid rgba(126,207,255,.15)', padding: '14px', color: BP.cyan, fontSize: '12px', marginBottom: '16px', overflowX: 'auto', fontFamily: BP.mono }}>
{`# Entrée : image/état s
# Sortie : Q(s, a) pour chaque action a

Q(s, a; θ) ≈ réseau(s; θ)

# Mise à jour par gradient descent :
L(θ) = E[ (r + γ·max Q(s', a'; θ) - Q(s, a; θ))² ]`}
          </pre>

          {/* Blueprint network diagram */}
          <div style={{ fontFamily: BP.mono, fontSize: '8px', color: BP.muted, letterSpacing: '0.1em', marginBottom: '10px', textTransform: 'uppercase' }}>
            FIG. 1 — ARCHITECTURE DQN
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center', margin: '8px 0 16px', overflowX: 'auto' }}>
            {LAYERS.map((layer, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{
                  background: `${layer.color}0d`,
                  border: `1px solid ${layer.color}44`,
                  padding: '10px 8px',
                  minHeight: `${layer.h}px`,
                  minWidth: '70px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  color: layer.color,
                  fontSize: '9px',
                  fontFamily: BP.mono,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                }}>
                  {layer.label}
                </div>
                {i < LAYERS.length - 1 && (
                  <svg width="20" height="14" style={{ flexShrink: 0 }}>
                    <line x1="0" y1="7" x2="14" y2="7" stroke="rgba(188,214,255,.3)" strokeWidth="1" strokeDasharray="2 2"/>
                    <polyline points="11,4 14,7 11,10" fill="none" stroke="rgba(188,214,255,.3)" strokeWidth="1"/>
                  </svg>
                )}
              </div>
            ))}
          </div>
        </SolutionBox>

        <div style={{ background: BP.surface, border: `1px solid ${BP.border}`, padding: '16px 20px', marginBottom: '24px', position: 'relative' }}>
          <span style={{ position:'absolute', top:0, left:0, color:'rgba(188,214,255,.4)', fontSize:'10px' }}>┌</span>
          <span style={{ position:'absolute', bottom:0, right:0, color:'rgba(188,214,255,.4)', fontSize:'10px' }}>┘</span>
          <div style={{ fontFamily: BP.mono, fontSize: '8px', color: BP.muted, letterSpacing: '0.12em', marginBottom: '8px', textTransform: 'uppercase' }}>IDÉE CLÉ</div>
          <p style={{ fontFamily: BP.mono, color: BP.text, lineHeight: '1.75', fontSize: '12px' }}>
            DQN a battu des humains à 49 jeux Atari en 2015. La même architecture,
            les mêmes hyperparamètres, uniquement les pixels en entrée. Preuve que le réseau
            peut extraire des représentations utiles directement depuis des observations brutes.
          </p>
        </div>

        <NextProblemBox nextPath="/replay" nextLabel="REPLAY + TARGET — ÉTAPE 03">
          <strong style={{ color: '#dce8fb' }}>Le réseau est instable</strong> : il court après une cible qui bouge sans cesse.
          Le réseau apprend à partir de ses propres prédictions — cela crée une boucle de feedback
          qui fait diverger l'apprentissage. De plus, les transitions consécutives sont fortement
          corrélées, ce qui casse les hypothèses du gradient stochastique.
          <br /><br />
          <span style={{ color: '#ffa26b' }}>→ Il faut stabiliser la cible et casser la corrélation temporelle.</span>
        </NextProblemBox>
      </motion.div>
    </div>
  )
}
