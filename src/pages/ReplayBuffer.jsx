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

export default function ReplayBuffer() {
  return (
    <div style={{ padding: '0 0 100px' }}>
      <ProgressMap currentId="replay" compact />

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ padding: '28px 36px', maxWidth: '900px' }}>
        <div style={{ fontFamily: BP.mono, fontSize: '8px', color: BP.cyan, letterSpacing: '0.12em', marginBottom: '6px', textTransform: 'uppercase' }}>
          ÉTAPE 03 — VALUE-BASED
        </div>
        <h1 style={{ fontFamily: BP.title, fontWeight: '800', fontSize: '36px', letterSpacing: '0.06em', textTransform: 'uppercase', margin: '0 0 6px', color: BP.text }}>
          REPLAY BUFFER + TARGET NETWORK
        </h1>
        <p style={{ fontFamily: BP.mono, color: BP.muted, fontSize: '12px', lineHeight: '1.8', marginBottom: '28px' }}>
          Deux techniques qui stabilisent DQN : briser la corrélation et geler la cible.
        </p>

        <ProblemBox>
          <strong style={{ color: '#dce8fb' }}>DQN est instable</strong> pour deux raisons :
          <ol style={{ marginTop: '10px', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '7px' }}>
            <li>Les transitions consécutives sont très corrélées — cela viole les hypothèses du SGD.</li>
            <li>La cible{' '}
              <code style={{ background: 'rgba(255,122,69,.1)', padding: '2px 4px', color: '#ff7a45' }}>
                r + γ·max Q(s', a'; θ)
              </code>{' '}
              change à chaque update — le réseau court après une cible mobile.
            </li>
          </ol>
        </ProblemBox>

        <SolutionBox title="DEUX SOLUTIONS EN TANDEM">
          {/* Replay Buffer */}
          <div style={{ background: '#071c36', border: '1px solid rgba(126,207,255,.18)', padding: '14px 18px', marginBottom: '12px', position: 'relative' }}>
            <span style={{ position:'absolute', top:0, left:0, color:'rgba(188,214,255,.35)', fontSize:'10px' }}>┌</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: BP.cyan, fontFamily: BP.mono, fontSize: '11px', fontWeight: '600', letterSpacing: '0.08em' }}>
              <span style={{ background: 'rgba(126,207,255,.12)', border: '1px solid rgba(126,207,255,.3)', padding: '1px 7px', fontSize: '9px' }}>01</span>
              REPLAY BUFFER
            </div>
            <p style={{ fontFamily: BP.mono, color: BP.muted, fontSize: '12px', marginBottom: '10px', lineHeight: '1.7' }}>
              Stocker les transitions passées dans une mémoire circulaire. À chaque update,
              tirer un mini-batch <em>aléatoire</em> — ce qui casse la corrélation temporelle.
            </p>
            <pre style={{ background: '#0a2342', border: '1px solid rgba(188,214,255,.12)', padding: '12px', color: BP.cyan, fontSize: '11px', overflowX: 'auto', fontFamily: BP.mono }}>
{`Mémoire D = { (s, a, r, s') ... }   ← buffer circulaire
À chaque step :
  1. Stocker (s, a, r, s') dans D
  2. Tirer aléatoirement un batch B ⊂ D
  3. Mettre à jour θ sur B`}
            </pre>
          </div>

          {/* Target Network */}
          <div style={{ background: '#071c36', border: '1px solid rgba(126,207,255,.18)', padding: '14px 18px', position: 'relative' }}>
            <span style={{ position:'absolute', top:0, left:0, color:'rgba(188,214,255,.35)', fontSize:'10px' }}>┌</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: BP.cyan, fontFamily: BP.mono, fontSize: '11px', fontWeight: '600', letterSpacing: '0.08em' }}>
              <span style={{ background: 'rgba(126,207,255,.12)', border: '1px solid rgba(126,207,255,.3)', padding: '1px 7px', fontSize: '9px' }}>02</span>
              TARGET NETWORK (θ⁻)
            </div>
            <p style={{ fontFamily: BP.mono, color: BP.muted, fontSize: '12px', marginBottom: '10px', lineHeight: '1.7' }}>
              Un réseau cible séparé, dont les poids sont copiés depuis θ seulement
              tous les N steps. La cible est ainsi gelée entre les copies.
            </p>
            <pre style={{ background: '#0a2342', border: '1px solid rgba(188,214,255,.12)', padding: '12px', color: BP.cyan, fontSize: '11px', overflowX: 'auto', fontFamily: BP.mono }}>
{`y = r + γ · max Q(s', a'; θ⁻)   ← θ⁻ gelé
L = (y - Q(s, a; θ))²
Tous les N steps : θ⁻ ← θ`}
            </pre>
          </div>
        </SolutionBox>

        <div style={{ background: BP.surface, border: `1px solid ${BP.border}`, padding: '16px 20px', marginBottom: '24px', position: 'relative' }}>
          <span style={{ position:'absolute', top:0, left:0, color:'rgba(188,214,255,.4)', fontSize:'10px' }}>┌</span>
          <span style={{ position:'absolute', bottom:0, right:0, color:'rgba(188,214,255,.4)', fontSize:'10px' }}>┘</span>
          <div style={{ fontFamily: BP.mono, fontSize: '8px', color: BP.muted, letterSpacing: '0.12em', marginBottom: '8px', textTransform: 'uppercase' }}>IDÉE CLÉ</div>
          <p style={{ fontFamily: BP.mono, color: BP.text, lineHeight: '1.75', fontSize: '12px' }}>
            Ces deux stabilisateurs font de DQN un algorithme robuste. Mais il reste limité à des
            espaces d'actions <strong style={{ color: BP.cyan }}>discrets</strong> :
            gauche, droite, feu… Pour contrôler une voiture autonome avec un volant à angle
            continu et des pédales à force variable, cette approche ne suffit plus.
          </p>
        </div>

        <NextProblemBox nextPath="/policy" nextLabel="POLICY-BASED — ÉTAPE 04">
          <strong style={{ color: '#dce8fb' }}>DQN ne gère que des actions discrètes.</strong>{' '}
          Quand l'espace d'action est continu (vitesse d'un moteur, angle de rotation, force appliquée),
          calculer{' '}
          <code style={{ background: 'rgba(255,122,69,.08)', padding: '2px 4px', color: '#ff7a45' }}>
            max Q(s', a')
          </code>{' '}
          sur un espace infini d'actions est impossible.
          <br /><br />
          <span style={{ color: '#ffa26b' }}>→ Il faut apprendre directement la politique π(a|s), pas la valeur.</span>
        </NextProblemBox>
      </motion.div>
    </div>
  )
}
