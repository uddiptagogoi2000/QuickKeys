import { useEffect, useState } from 'react'

// when play it should play
// when pause it should pause

// when play and timer >= duration

// eslint-disable-next-line react/prop-types
export default function GameReplayEffect({ duration = 5000 }) {
  // const [play, setPlay] = useState(false)
  const [timer, setTimer] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const isOver = timer >= duration

  // let intervalId = intervalIdRef.current
  console.log('isOver', isOver)

  useEffect(() => {
    if (isOver) {
      return
    }
    let intervalID

    if (isPlaying === false) {
      intervalID = window.setInterval(() => {
        setTimer((t) => t + 1000)
      }, 1000)
    }

    return () => {
      window.clearInterval(intervalID)
      console.log('cleared interval')

      if (isOver) {
        setIsPlaying(false)
      }
    }
  }, [isPlaying, isOver])

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleReset = () => {
    setTimer(0)
    setIsPlaying(true)
  }

  return (
    <div className='mt-5'>
      <h3>Game Replay</h3>
      <p>{timer}</p>

      <div className='flex gap-2'>
        {isOver ? (
          <button
            onClick={handleReset}
            className='px-3 border-2 border-purple-900 rounded-md'
          >
            Reset
          </button>
        ) : (
          <button
            onClick={handlePlayPause}
            className='px-3 border-2 border-purple-900 rounded-md'
          >
            {isPlaying ? 'Pause' : 'Play'}
          </button>
        )}
      </div>
    </div>
  )
}
