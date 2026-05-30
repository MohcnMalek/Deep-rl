import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'

const BP = {
  surface: '#0d2b50', border: 'rgba(188,214,255,.18)',
  text: '#dce8fb', muted: '#7fa3cf', cyan: '#7ecfff',
  mono: 'IBM Plex Mono, monospace', title: 'Saira Condensed, sans-serif',
}

const TERMS = [
  { term: 'Q(s, a)', def: 'Fonction de valeur action-état. Estime le retour futur espéré en prenant l\'action a dans l\'état s, puis en suivant la politique optimale.', color: '#7ecfff' },
  { term: 'Politique π(a|s)', def: 'Fonction qui associe à chaque état une distribution sur les actions. Déterministe : π(s) = a. Stochastique : π(a|s) = P(action=a | état=s).', color: '#b39dff' },
  { term: 'Bellman Equation', def: 'Équation de récurrence qui décompose la valeur d\'un état en récompense immédiate + valeur future escomptée. Fondement de Q-Learning.', color: '#7ecfff' },
  { term: 'Replay Buffer', def: 'Mémoire circulaire stockant les transitions (s, a, r, s\'). Permet de réutiliser les expériences passées et de casser la corrélation temporelle.', color: '#7ecfff' },
  { term: 'Target Network (θ⁻)', def: 'Copie des poids du réseau principal, mise à jour moins fréquemment. Fournit une cible stable pour le calcul de la loss dans DQN.', color: '#7ecfff' },
  { term: 'ε-greedy', def: 'Stratégie d\'exploration : avec probabilité ε, choisir une action aléatoire (exploration) ; sinon, choisir la meilleure action connue (exploitation).', color: '#ffa26b' },
  { term: 'Gradient de politique', def: 'Méthode qui met à jour θ en montant le gradient de l\'espérance de récompense : ∇θ J = E[∇θ log π(a|s;θ) · G_t].', color: '#b39dff' },
  { term: 'Avantage A(s,a)', def: 'A(s,a) = Q(s,a) - V(s). Mesure combien l\'action a est meilleure que l\'action moyenne dans l\'état s. Réduit la variance par rapport à G_t.', color: '#ff9f6b' },
  { term: 'V(s)', def: 'Fonction de valeur d\'état. Estime le retour futur espéré depuis s en suivant la politique courante. Estimée par le Critic dans Actor-Critic.', color: '#ff9f6b' },
  { term: 'Clipping (PPO)', def: 'Troncature du ratio r_t(θ) = π_new/π_old dans [1-ε, 1+ε]. Empêche des mises à jour trop grandes qui pourraient détruire une bonne politique.', color: '#5dd1a0' },
  { term: 'RLHF', def: 'Reinforcement Learning from Human Feedback. Technique utilisée pour aligner les LLMs (ChatGPT) : un modèle de récompense humain entraîne PPO sur des réponses.', color: '#5dd1a0' },
  { term: 'Model-free', def: 'Apprentissage sans modèle explicite des transitions P(s\'|s,a). L\'agent apprend uniquement par interaction directe avec l\'environnement.', color: BP.muted },
  { term: 'Discount γ', def: 'Facteur d\'escompte ∈ [0,1]. γ proche de 1 = agent patient (valorise le futur). γ proche de 0 = agent myopique qui ne valorise que le présent.', color: BP.muted },
  { term: 'On-policy vs Off-policy', def: 'On-policy (PPO, SARSA) : apprend sur la politique courante. Off-policy (DQN, Q-Learning) : apprend sur des données collectées par une autre politique.', color: BP.muted },
  { term: 'LIDAR (RL)', def: 'Dans les simulations de conduite, rayons de mesure de distance depuis le véhicule. Discrétisés pour former l\'espace d\'état d\'un agent Q-Learning.', color: '#7ecfff' },
]

export default function Glossary() {
  const [search, setSearch] = useState('')

  const filtered = TERMS.filter(t =>
    t.term.toLowerCase().includes(search.toLowerCase()) ||
    t.def.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ padding: '0 0 100px' }}>
      <div style={{ padding: '28px 36px', maxWidth: '840px' }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ fontFamily: BP.mono, fontSize: '8px', color: BP.muted, letterSpacing: '0.12em', marginBottom: '6px', textTransform: 'uppercase' }}>
            ÉTAPE 10 — RÉFÉRENCE
          </div>
          <h1 style={{ fontFamily: BP.title, fontWeight: '800', fontSize: '36px', letterSpacing: '0.06em', textTransform: 'uppercase', margin: '0 0 20px', color: BP.text }}>
            GLOSSAIRE
          </h1>

          {/* Search */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            background: '#071c36', border: `1px solid ${BP.border}`,
            padding: '9px 14px', marginBottom: '20px',
          }}>
            <Search size={13} color={BP.muted} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher un terme..."
              style={{
                flex: 1, background: 'transparent', border: 'none', outline: 'none',
                color: BP.text, fontFamily: BP.mono, fontSize: '12px',
              }}
            />
            {search && (
              <span style={{ fontFamily: BP.mono, fontSize: '9px', color: BP.muted }}>
                {filtered.length} TERME{filtered.length !== 1 ? 'S' : ''}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {filtered.map((t, i) => (
              <motion.div
                key={t.term}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.025 }}
                style={{
                  background: '#071c36',
                  border: `1px solid ${t.color}28`,
                  borderLeft: `2px solid ${t.color}55`,
                  padding: '12px 16px',
                  display: 'flex',
                  gap: '18px',
                }}
              >
                <div style={{
                  flexShrink: 0, minWidth: '150px',
                  fontFamily: BP.mono, color: t.color, fontSize: '12px',
                  fontWeight: '600', letterSpacing: '0.04em', paddingTop: '1px',
                }}>
                  {t.term}
                </div>
                <div style={{ fontFamily: BP.mono, color: BP.muted, fontSize: '12px', lineHeight: '1.75', letterSpacing: '0.02em' }}>
                  {t.def}
                </div>
              </motion.div>
            ))}
            {filtered.length === 0 && (
              <div style={{ fontFamily: BP.mono, color: BP.muted, textAlign: 'center', padding: '32px', fontSize: '12px', letterSpacing: '0.06em' }}>
                AUCUN TERME TROUVÉ POUR « {search} »
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
