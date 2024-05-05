// states -
// 1. Looking for competitors
// 2. Ready to race
// 3. It's the final Countdown
// 4. Go!

import { useContext, useEffect, useReducer } from 'react'
import gameBoardContext from './gameBoardContext'

const stages = {
  1: 'Looking for competitors...',
  2: 'Get ready to race',
  3: "It's the final Countdown",
  4: 'Go!',
}

const timerReducer = (state, action) => {
  switch (action.type) {
    case 'DECREMENT_TIMER': {
      if (state <= 0) {
        return state
      }
      return state - 1000
    }
    default:
      return state
  }
}

// eslint-disable-next-line react/prop-types
const GameCountdown = ({ duration = 10000 }) => {
  const [timer, dispatchTimer] = useReducer(timerReducer, duration)
  const { players, handleBeginRacing } = useContext(gameBoardContext)
  const isOver = timer <= 0
  const countdown = timer / 1000
  const hasEnoughPlayers = players && players.length > 2
  const statusText =
    timer === duration
      ? stages[1]
      : timer > 5000 && timer < duration
      ? stages[2]
      : timer <= 5000 && timer > 1000
      ? stages[3]
      : stages[4]

  useEffect(() => {
    let intervalID
    if (isOver) {
      handleBeginRacing(true)
      window.clearInterval(intervalID)
      return
    }

    if (!isOver && hasEnoughPlayers) {
      intervalID = window.setInterval(() => {
        dispatchTimer({ type: 'DECREMENT_TIMER' })
      }, 1000)
    }

    return () => {
      window.clearInterval(intervalID)
    }
  }, [isOver, hasEnoughPlayers, handleBeginRacing])

  if (!players || isOver) {
    console.log('returning null')
    return null
  }

  return (
    <div className='text-center text-xl font-bold text-white inline-flex gap-4 border-2 border-purple-500 bg-purple-700 absolute -left-8 px-2 items-center'>
      <div className='w-64'>{statusText}</div>
      {players.length > 2 && <div className='text-3xl'>:{countdown}</div>}
    </div>
  )
}

export default GameCountdown
