// GameboardContainer starts the game timer and displays the time remaining
// cannot be paused or reset once started
// Only when the game is over the timer stops and displays 'The race has ended'
// On component unmout, the timer is cleared
// On component mount, the timer is set to X seconds and decrements every second

import { useContext, useEffect, useReducer } from 'react'
import { formattedTimer } from '../utils/helpers'
import gameBoardContext from './gameBoardContext'

const reducer = (state, action) => {
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
const GameTimer = ({ duration = 100000 }) => {
  const { beginRacing, handleBeginRacing } = useContext(gameBoardContext)
  const [timer, dispatch] = useReducer(reducer, duration)
  const timerDisplay = formattedTimer(timer)
  const isOver = timer <= 0

  console.log('rendering timer')

  useEffect(() => {
    if (isOver) {
      handleBeginRacing(false)
      return
    }
    let intervalID

    if (!isOver && beginRacing) {
      intervalID = window.setInterval(() => {
        dispatch({ type: 'DECREMENT_TIMER' })
      }, 1000)
    }

    return () => {
      if (intervalID) {
        window.clearInterval(intervalID)
      }
    }
  }, [isOver, beginRacing, handleBeginRacing])

  return (
    <div className='text-right py-5'>
      {isOver ? 'The race has finished!' : <span>{timerDisplay}</span>}
    </div>
  )
}

export default GameTimer
