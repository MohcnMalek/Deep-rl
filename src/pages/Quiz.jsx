import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RotateCcw, ChevronRight } from 'lucide-react'

const BP = {
  surface: '#0d2b50', border: 'rgba(188,214,255,.18)',
  text: '#dce8fb', muted: '#7fa3cf', cyan: '#7ecfff',
  solution: '#5dd1a0', problem: '#ff7a45',
  mono: 'IBM Plex Mono, monospace', title: 'Saira Condensed, sans-serif',
}

const QUESTIONS = [
  {
    question: 'Quel problème DQN résout-il par rapport à Q-Learning ?',
    options: [
      'Il rend l\'apprentissage plus lent',
      'Il remplace la Q-table trop grande par un réseau de neurones',
      'Il élimine le besoin de récompenses',
      'Il gère les actions continues',
    ],
    correct: 1,
    explanation: 'La Q-table devient impraticable pour des espaces d\'états grands (ex : pixels Atari). DQN approxime Q(s,a) avec un réseau de neurones — on remplace un tableau par une fonction paramétrique.',
  },
  {
    question: 'Pourquoi le Target Network est-il nécessaire dans DQN ?',
    options: [
      'Pour accélérer l\'inférence',
      'Pour réduire la taille du réseau',
      'Pour geler la cible et éviter que le réseau coure après une cible mobile',
      'Pour gérer les actions continues',
    ],
    correct: 2,
    explanation: 'Sans Target Network, la cible r + γ·max Q(s\', a\'; θ) change à chaque update — le réseau court après sa propre queue. Geler θ⁻ pendant N steps stabilise l\'apprentissage.',
  },
  {
    question: 'Quelle est la limite principale de REINFORCE (policy gradient pur) ?',
    options: [
      'Il ne peut pas gérer les actions continues',
      'Il a une très forte variance du gradient, rendant l\'apprentissage bruité',
      'Il ne converge jamais vers la politique optimale',
      'Il nécessite un modèle de l\'environnement',
    ],
    correct: 1,
    explanation: 'REINFORCE estime le gradient avec G_t = retour de tout l\'épisode, qui varie beaucoup d\'un épisode à l\'autre. Cette haute variance rend l\'apprentissage lent et instable. Actor-Critic résout cela avec le Critic.',
  },
  {
    question: 'Dans Actor-Critic, quel est le rôle du Critic ?',
    options: [
      'Choisir les actions à prendre',
      'Stocker les transitions dans le Replay Buffer',
      'Évaluer la qualité d\'un état via V(s) pour calculer l\'avantage A',
      'Clipper le ratio de politiques',
    ],
    correct: 2,
    explanation: 'L\'Actor choisit les actions (π(a|s)). Le Critic estime V(s) et calcule l\'avantage A(s,a) = r + γV(s\') - V(s). Cet avantage remplace le retour bruité G_t dans la mise à jour de l\'Actor.',
  },
  {
    question: 'Que fait le "clipping" dans PPO ?',
    options: [
      'Il coupe les épisodes trop longs',
      'Il supprime les actions peu probables',
      'Il borne le ratio π_new/π_old dans [1-ε, 1+ε] pour limiter la taille du pas',
      'Il réinitialise les poids si la loss est trop haute',
    ],
    correct: 2,
    explanation: 'Le clipping PPO borne r_t(θ) = π(a|s;θ)/π(a|s;θ_old) dans [1-ε, 1+ε]. Si la nouvelle politique s\'éloigne trop de l\'ancienne, le gradient est tronqué — garantissant des petits pas sûrs.',
  },
]

export default function Quiz() {
  const [current, setCurrent]   = useState(0)
  const [selected, setSelected] = useState(null)
  const [confirmed, setConfirmed] = useState(false)
  const [score, setScore]       = useState(0)
  const [finished, setFinished] = useState(false)
  const [answers, setAnswers]   = useState([])

  const q = QUESTIONS[current]
  const isCorrect = selected === q.correct

  const handleConfirm = () => {
    if (selected === null) return
    setConfirmed(true)
    if (isCorrect) setScore(s => s + 1)
    setAnswers(prev => [...prev, { ok: selected === q.correct }])
  }

  const handleNext = () => {
    if (current < QUESTIONS.length - 1) {
      setCurrent(c => c + 1); setSelected(null); setConfirmed(false)
    } else setFinished(true)
  }

  const handleReset = () => {
    setCurrent(0); setSelected(null); setConfirmed(false)
    setScore(0); setFinished(false); setAnswers([])
  }

  const btnBase = { cursor: 'pointer', fontFamily: BP.title, fontWeight: '700', fontSize: '13px', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '10px 20px' }

  if (finished) {
    return (
      <div style={{ padding: '28px 36px', maxWidth: '700px' }}>
        <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}>
          <div style={{
            background: score >= 4 ? 'rgba(93,209,160,.06)' : 'rgba(255,162,107,.06)',
            border: `1px solid ${score >= 4 ? 'rgba(93,209,160,.3)' : 'rgba(255,162,107,.3)'}`,
            padding: '28px 32px',
            textAlign: 'center',
            marginBottom: '24px',
            position: 'relative',
          }}>
            <span style={{ position:'absolute', top:0, left:0, color:'rgba(188,214,255,.3)', fontSize:'10px' }}>┌</span>
            <span style={{ position:'absolute', bottom:0, right:0, color:'rgba(188,214,255,.3)', fontSize:'10px' }}>┘</span>
            <div style={{ fontFamily: BP.mono, fontSize: '9px', color: BP.muted, letterSpacing: '0.1em', marginBottom: '10px' }}>
              RÉSULTAT FINAL
            </div>
            <div style={{ fontFamily: BP.title, fontWeight: '800', fontSize: '48px', color: score >= 4 ? BP.solution : '#ffa26b', letterSpacing: '0.06em' }}>
              {score} / {QUESTIONS.length}
            </div>
            <p style={{ fontFamily: BP.mono, color: BP.muted, fontSize: '12px', marginTop: '8px' }}>
              {score === 5 ? 'PARFAIT — Vous maîtrisez le fil rouge du Deep RL.' : score >= 3 ? 'BON SCORE — Relisez les points manqués.' : 'RETOURNEZ parcourir les pages des algorithmes.'}
            </p>
          </div>

          {answers.map((a, i) => (
            <div key={i} style={{
              display: 'flex', gap: '10px', padding: '10px 14px', marginBottom: '6px',
              background: '#071c36',
              border: `1px solid ${a.ok ? 'rgba(93,209,160,.25)' : 'rgba(255,122,69,.25)'}`,
              alignItems: 'center',
            }}>
              <span style={{ color: a.ok ? BP.solution : BP.problem, fontFamily: BP.mono, fontSize: '10px', minWidth: '12px' }}>
                {a.ok ? '✓' : '✗'}
              </span>
              <span style={{ fontFamily: BP.mono, color: BP.muted, fontSize: '11px', flex: 1 }}>
                {QUESTIONS[i].question}
              </span>
            </div>
          ))}

          <motion.button whileHover={{ scale: 1.02 }} onClick={handleReset} style={{
            ...btnBase,
            display: 'flex', alignItems: 'center', gap: '8px',
            margin: '20px auto 0',
            background: 'rgba(126,207,255,.08)',
            border: '1px solid rgba(126,207,255,.35)',
            color: BP.cyan,
          }}>
            <RotateCcw size={12} /> RECOMMENCER
          </motion.button>
        </motion.div>
      </div>
    )
  }

  return (
    <div style={{ padding: '28px 36px', maxWidth: '700px' }}>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <div style={{ fontFamily: BP.mono, fontSize: '8px', color: BP.muted, letterSpacing: '0.12em', marginBottom: '6px', textTransform: 'uppercase' }}>
          ÉTAPE 09 — QUIZ
        </div>
        <h1 style={{ fontFamily: BP.title, fontWeight: '800', fontSize: '36px', letterSpacing: '0.06em', textTransform: 'uppercase', margin: '0 0 6px', color: BP.text }}>
          QUIZ — FIL ROUGE
        </h1>
        <p style={{ fontFamily: BP.mono, color: BP.muted, fontSize: '12px', lineHeight: '1.8', marginBottom: '24px' }}>
          Testez votre compréhension de la logique problème → solution.
        </p>

        {/* Progress bar */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '24px' }}>
          {QUESTIONS.map((_, i) => (
            <div key={i} style={{
              flex: 1, height: '3px',
              background: i < current ? BP.solution : i === current ? BP.cyan : 'rgba(188,214,255,.15)',
              transition: 'background 0.3s',
            }} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
          >
            <div style={{ fontFamily: BP.mono, fontSize: '9px', color: BP.muted, letterSpacing: '0.1em', marginBottom: '8px' }}>
              QUESTION {current + 1} / {QUESTIONS.length}
            </div>
            <h2 style={{ fontFamily: BP.mono, color: BP.text, fontSize: '14px', fontWeight: '500', lineHeight: '1.7', margin: '0 0 20px' }}>
              {q.question}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
              {q.options.map((opt, i) => {
                let border = 'rgba(188,214,255,.15)', bg = '#071c36', color = BP.muted
                if (selected === i) { bg = 'rgba(126,207,255,.06)'; border = `rgba(126,207,255,.5)`; color = BP.text }
                if (confirmed) {
                  if (i === q.correct) { bg = 'rgba(93,209,160,.06)'; border = 'rgba(93,209,160,.5)'; color = BP.solution }
                  else if (selected === i) { bg = 'rgba(255,122,69,.06)'; border = 'rgba(255,122,69,.4)'; color = BP.problem }
                }
                return (
                  <motion.button
                    key={i}
                    whileHover={!confirmed ? { x: 3 } : {}}
                    whileTap={!confirmed ? { scale: 0.99 } : {}}
                    onClick={() => !confirmed && setSelected(i)}
                    style={{
                      background: bg, border: `1px solid ${border}`,
                      padding: '12px 16px', cursor: confirmed ? 'default' : 'pointer',
                      color, textAlign: 'left', fontSize: '12px', lineHeight: '1.6',
                      fontFamily: BP.mono, display: 'flex', alignItems: 'center', gap: '10px',
                      letterSpacing: '0.02em',
                    }}
                  >
                    <span style={{
                      width: '20px', height: '20px', border: `1px solid ${border}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '9px', fontFamily: BP.mono, flexShrink: 0, color,
                    }}>
                      {confirmed && i === q.correct ? '✓' : confirmed && selected === i ? '✗' : String.fromCharCode(65 + i)}
                    </span>
                    {opt}
                  </motion.button>
                )
              })}
            </div>

            <AnimatePresence>
              {confirmed && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  style={{
                    background: isCorrect ? 'rgba(93,209,160,.06)' : 'rgba(255,122,69,.06)',
                    border: `1px solid ${isCorrect ? 'rgba(93,209,160,.3)' : 'rgba(255,122,69,.3)'}`,
                    padding: '12px 16px', marginBottom: '16px',
                  }}
                >
                  <p style={{ fontFamily: BP.mono, color: BP.text, fontSize: '12px', lineHeight: '1.7', margin: 0 }}>
                    <span style={{ color: isCorrect ? BP.solution : BP.problem, fontWeight:'600', marginRight:'6px' }}>
                      {isCorrect ? '✓ CORRECT' : '✗ INCORRECT'}
                    </span>
                    {q.explanation}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {!confirmed ? (
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={handleConfirm} disabled={selected === null}
                style={{
                  ...btnBase,
                  background: selected !== null ? 'rgba(126,207,255,.08)' : 'transparent',
                  border: `1px solid ${selected !== null ? 'rgba(126,207,255,.4)' : 'rgba(188,214,255,.15)'}`,
                  color: selected !== null ? BP.cyan : BP.muted,
                  cursor: selected !== null ? 'pointer' : 'not-allowed',
                }}
              >VALIDER</motion.button>
            ) : (
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={handleNext}
                style={{
                  ...btnBase, display: 'flex', alignItems: 'center', gap: '8px',
                  background: 'rgba(93,209,160,.08)', border: '1px solid rgba(93,209,160,.35)',
                  color: BP.solution, cursor: 'pointer',
                }}
              >
                {current < QUESTIONS.length - 1 ? 'QUESTION SUIVANTE' : 'VOIR LE SCORE'}
                <ChevronRight size={13} />
              </motion.button>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
