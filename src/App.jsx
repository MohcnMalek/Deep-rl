import { HashRouter, Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Home from './pages/Home'
import QLearning from './pages/QLearning'
import DQN from './pages/DQN'
import ReplayBuffer from './pages/ReplayBuffer'
import PolicyBased from './pages/PolicyBased'
import ActorCritic from './pages/ActorCritic'
import PPO from './pages/PPO'
import Comparison from './pages/Comparison'
import Simulation from './pages/Simulation'
import Quiz from './pages/Quiz'
import Glossary from './pages/Glossary'

const ROUTE_META = {
  '/':             { title: 'ACCUEIL',       plate: '00' },
  '/q-learning':   { title: 'Q-TABLE',       plate: '01' },
  '/dqn':          { title: 'DQN',           plate: '02' },
  '/replay':       { title: 'REPLAY+TARGET', plate: '03' },
  '/policy':       { title: 'POLICY-BASED',  plate: '04' },
  '/actor-critic': { title: 'ACTOR-CRITIC',  plate: '05' },
  '/ppo':          { title: 'PPO',           plate: '06' },
  '/comparison':   { title: 'COMPARAISON',   plate: '07' },
  '/simulation':   { title: 'SIMULATION',    plate: '08' },
  '/quiz':         { title: 'QUIZ',          plate: '09' },
  '/glossary':     { title: 'GLOSSAIRE',     plate: '10' },
}

export default function App() {
  return (
    <HashRouter>
      <div style={{ display: 'flex', minHeight: '100vh', background: '#0a2342' }}>
        <Sidebar />
        <main style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', position: 'relative', paddingBottom: '80px' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/q-learning" element={<QLearning />} />
            <Route path="/dqn" element={<DQN />} />
            <Route path="/replay" element={<ReplayBuffer />} />
            <Route path="/policy" element={<PolicyBased />} />
            <Route path="/actor-critic" element={<ActorCritic />} />
            <Route path="/ppo" element={<PPO />} />
            <Route path="/comparison" element={<Comparison />} />
            <Route path="/simulation" element={<Simulation />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/glossary" element={<Glossary />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  )
}
