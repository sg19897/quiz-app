import React, { useState, useEffect, useCallback } from 'react'
import { questions } from './data/questions'

const TIMER_DURATION = 15

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5)
}

export default function App() {
  const [screen, setScreen] = useState('start') // start | quiz | result
  const [shuffled, setShuffled] = useState([])
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)
  const [answers, setAnswers] = useState([])
  const [timer, setTimer] = useState(TIMER_DURATION)

  const handleStart = () => {
    setShuffled(shuffle(questions))
    setCurrent(0)
    setSelected(null)
    setScore(0)
    setAnswers([])
    setTimer(TIMER_DURATION)
    setScreen('quiz')
  }

  const handleNext = useCallback(() => {
    const q = shuffled[current]
    const isCorrect = selected === q.answer
    const newAnswers = [...answers, { question: q.question, selected, correct: q.answer, isCorrect }]
    setAnswers(newAnswers)
    if (isCorrect) setScore(s => s + 1)

    if (current + 1 >= shuffled.length) {
      setScreen('result')
    } else {
      setCurrent(c => c + 1)
      setSelected(null)
      setTimer(TIMER_DURATION)
    }
  }, [current, selected, shuffled, answers])

  // Timer
  useEffect(() => {
    if (screen !== 'quiz') return
    if (timer === 0) { handleNext(); return }
    const t = setTimeout(() => setTimer(t => t - 1), 1000)
    return () => clearTimeout(t)
  }, [timer, screen, handleNext])

  const pct = Math.round((score / shuffled.length) * 100)

  const cardStyle = {
    background: 'rgba(255,255,255,0.15)',
    backdropFilter: 'blur(15px)',
    borderRadius: '20px',
    padding: '2.5rem',
    width: '100%',
    maxWidth: '580px',
    color: '#fff',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
  }

  if (screen === 'start') return (
    <div style={cardStyle}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', textAlign: 'center' }}>🧠 Frontend Quiz</h1>
      <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.8)', marginBottom: '2rem' }}>
        Test your knowledge in HTML, CSS, JavaScript & React.<br/>
        10 questions · 15 seconds each
      </p>
      <button onClick={handleStart} style={btnStyle}>Start Quiz</button>
    </div>
  )

  if (screen === 'result') return (
    <div style={cardStyle}>
      <h2 style={{ textAlign: 'center', fontSize: '1.8rem', marginBottom: '0.5rem' }}>Quiz Complete!</h2>
      <div style={{ textAlign: 'center', margin: '1.5rem 0' }}>
        <div style={{ fontSize: '4rem', fontWeight: '800' }}>{score}/{shuffled.length}</div>
        <div style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.7)' }}>{pct}% correct</div>
        <div style={{ marginTop: '0.5rem', fontSize: '1.5rem' }}>
          {pct >= 80 ? '🎉 Excellent!' : pct >= 60 ? '👍 Good job!' : '📚 Keep practicing!'}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '250px', overflowY: 'auto', marginBottom: '1.5rem' }}>
        {answers.map((a, i) => (
          <div key={i} style={{ background: a.isCorrect ? 'rgba(39,174,96,0.3)' : 'rgba(231,76,60,0.3)', borderRadius: '8px', padding: '0.7rem 1rem', fontSize: '0.85rem' }}>
            <strong>Q{i+1}:</strong> {a.question}<br/>
            {!a.isCorrect && <span style={{ color: '#ff6b6b' }}>Your: {a.selected || 'Timed out'} · </span>}
            <span style={{ color: '#6bffb5' }}>Correct: {a.correct}</span>
          </div>
        ))}
      </div>
      <button onClick={handleStart} style={btnStyle}>Play Again</button>
    </div>
  )

  const q = shuffled[current]
  const timerColor = timer <= 5 ? '#ff6b6b' : timer <= 10 ? '#f39c12' : '#6bffb5'

  return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}>
        <span>Question {current + 1} / {shuffled.length}</span>
        <span style={{ color: timerColor, fontWeight: '700', fontSize: '1rem' }}>⏱ {timer}s</span>
        <span style={{ background: 'rgba(108,99,255,0.5)', padding: '0.2rem 0.7rem', borderRadius: '12px' }}>{q.category}</span>
      </div>

      {/* Progress bar */}
      <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '4px', height: '6px', marginBottom: '1.5rem' }}>
        <div style={{ width: `${((current) / shuffled.length) * 100}%`, background: '#6c63ff', height: '100%', borderRadius: '4px', transition: 'width 0.3s' }} />
      </div>

      <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>{q.question}</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '1.5rem' }}>
        {q.options.map(opt => {
          let bg = 'rgba(255,255,255,0.1)'
          if (selected === opt) bg = 'rgba(108,99,255,0.7)'
          return (
            <button key={opt} onClick={() => !selected && setSelected(opt)} style={{ ...optStyle, background: bg }}>
              {opt}
            </button>
          )
        })}
      </div>

      <button onClick={handleNext} disabled={!selected} style={{ ...btnStyle, opacity: selected ? 1 : 0.5 }}>
        {current + 1 === shuffled.length ? 'Finish' : 'Next →'}
      </button>
    </div>
  )
}

const btnStyle = {
  width: '100%', padding: '0.9rem', background: '#6c63ff', color: '#fff',
  border: 'none', borderRadius: '12px', fontSize: '1rem', fontWeight: '700',
  cursor: 'pointer', transition: 'background 0.2s',
}

const optStyle = {
  padding: '0.9rem 1.2rem', border: '2px solid rgba(255,255,255,0.2)',
  borderRadius: '10px', color: '#fff', fontSize: '0.95rem', textAlign: 'left',
  cursor: 'pointer', transition: 'background 0.2s',
}
