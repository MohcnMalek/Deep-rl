import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Home, Table2, Brain, Layers, Shuffle, User, Trophy,
  BarChart2, Gamepad2, HelpCircle, BookOpen, ChevronRight
} from 'lucide-react'

const BP = {
  bg:      '#071c36',
  surface: '#0a2342',
  border:  'rgba(188,214,255,.15)',
  text:    '#dce8fb',
  muted:   '#7fa3cf',
  mono:    'IBM Plex Mono, monospace',
  title:   'Saira Condensed, sans-serif',
}

const NAV = [
  { label: 'ACCUEIL', path: '/', icon: Home },
  { type: 'divider', label: 'VALUE-BASED', color: '#7ecfff' },
  { label: 'Q-LEARNING', path: '/q-learning', icon: Table2, color: '#7ecfff', num: '01' },
  { label: 'DQN', path: '/dqn', icon: Brain, color: '#7ecfff', num: '02' },
  { label: 'REPLAY + TARGET', path: '/replay', icon: Layers, color: '#7ecfff', num: '03' },
  { type: 'divider', label: 'POLICY-BASED', color: '#b39dff' },
  { label: 'POLICY GRADIENT', path: '/policy', icon: Shuffle, color: '#b39dff', num: '04' },
  { type: 'divider', label: 'HYBRIDE', color: '#ff9f6b' },
  { label: 'ACTOR-CRITIC', path: '/actor-critic', icon: User, color: '#ff9f6b', num: '05' },
  { label: 'PPO ✓', path: '/ppo', icon: Trophy, color: '#5dd1a0', num: '06' },
  { type: 'divider', label: 'EXPLORER', color: null },
  { label: 'COMPARAISON', path: '/comparison', icon: BarChart2, num: '07' },
  { label: 'SIMULATION', path: '/simulation', icon: Gamepad2, num: '08' },
  { label: 'QUIZ', path: '/quiz', icon: HelpCircle, num: '09' },
  { label: 'GLOSSAIRE', path: '/glossary', icon: BookOpen, num: '10' },
]

export default function Sidebar() {
  return (
    <nav style={{
      width: '230px',
      minWidth: '230px',
      background: BP.bg,
      borderRight: `1px solid ${BP.border}`,
      height: '100vh',
      position: 'sticky',
      top: 0,
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
    }}>

      {/* Logo / title block */}
      <div style={{
        padding: '18px 16px 14px',
        borderBottom: `1px solid ${BP.border}`,
        position: 'relative',
      }}>
        {/* corner marks */}
        <span style={{ position:'absolute', top:6, left:6, color:'rgba(188,214,255,.4)', fontSize:'10px', lineHeight:1 }}>┌</span>
        <span style={{ position:'absolute', top:6, right:6, color:'rgba(188,214,255,.4)', fontSize:'10px', lineHeight:1 }}>┐</span>

        <div style={{
          fontFamily: BP.title,
          fontWeight: '800',
          fontSize: '22px',
          letterSpacing: '0.08em',
          color: '#7ecfff',
          textTransform: 'uppercase',
          lineHeight: 1,
        }}>
          DEEP<span style={{ color: '#b39dff' }}>RL</span>
        </div>
        <div style={{
          fontFamily: BP.mono,
          fontSize: '8px',
          color: BP.muted,
          marginTop: '4px',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          borderTop: '1px dashed rgba(188,214,255,.15)',
          paddingTop: '4px',
        }}>
          PROBLÈME → SOLUTION
        </div>
        <div style={{
          fontFamily: BP.mono,
          fontSize: '7px',
          color: 'rgba(127,163,207,.5)',
          marginTop: '2px',
          letterSpacing: '0.1em',
        }}>
          VOITURE AUTONOME · 2026
        </div>
      </div>

      {/* Navigation */}
      <div style={{ flex: 1, padding: '8px 0' }}>
        {NAV.map((item, i) => {
          if (item.type === 'divider') {
            return (
              <div key={i} style={{
                padding: '10px 16px 4px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                <span style={{
                  color: item.color || BP.muted,
                  fontSize: '8px',
                  fontWeight: '600',
                  letterSpacing: '0.15em',
                  fontFamily: BP.mono,
                  opacity: 0.7,
                }}>
                  {item.label}
                </span>
                <div style={{
                  flex: 1,
                  height: '1px',
                  background: item.color
                    ? `linear-gradient(90deg, ${item.color}44, transparent)`
                    : 'rgba(188,214,255,.1)',
                }} />
              </div>
            )
          }

          const Icon = item.icon
          const accentColor = item.color || BP.muted

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '7px 16px',
                textDecoration: 'none',
                color: isActive ? accentColor : BP.muted,
                background: isActive ? `${accentColor}10` : 'transparent',
                borderLeft: isActive ? `2px solid ${accentColor}` : '2px solid transparent',
                fontSize: '11px',
                fontWeight: isActive ? '600' : '400',
                fontFamily: BP.mono,
                letterSpacing: '0.06em',
                transition: 'all 0.12s',
                position: 'relative',
              })}
            >
              {({ isActive }) => (
                <>
                  {item.num && (
                    <span style={{
                      fontSize: '8px',
                      opacity: 0.4,
                      minWidth: '14px',
                      fontFamily: BP.mono,
                      color: isActive ? accentColor : BP.muted,
                    }}>
                      {item.num}
                    </span>
                  )}
                  <Icon size={12} strokeWidth={1.5} />
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {isActive && (
                    <motion.span
                      initial={{ opacity: 0, x: -4 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <ChevronRight size={10} />
                    </motion.span>
                  )}
                </>
              )}
            </NavLink>
          )
        })}
      </div>

      {/* Bottom annotation */}
      <div style={{
        padding: '10px 16px',
        borderTop: `1px solid ${BP.border}`,
        fontFamily: BP.mono,
        fontSize: '7px',
        color: 'rgba(127,163,207,.4)',
        letterSpacing: '0.08em',
      }}>
        <span>MOUHCINE MALEK</span>
        <span style={{ display:'block' }}>DEEP RL — 2026</span>
      </div>
    </nav>
  )
}
