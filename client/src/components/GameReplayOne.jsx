/* eslint-disable react/prop-types */
import { useContext, useEffect, useRef, useState } from 'react'
import { formattedTimer, getClickPosition } from '../utils/helpers'
import gameBoardContext from './gameBoardContext'

// const initialTypingState = {
//   2000: {
//     textCompleted: 'H',
//     typingReplay: 'H',
//   },
//   4000: {
//     textCompleted: 'He',
//     typingReplay: 'He',
//   },
//   4200: {
//     textCompleted: 'Hey',
//     typingReplay: 'Hey',
//   },
//   5400: {
//     textCompleted: 'Hey ',
//     typingReplay: 'Hey ',
//   },
//   6500: {
//     textCompleted: 'Hey t',
//     typingReplay: 'Hey t',
//   },
//   9600: {
//     textCompleted: 'Hey th',
//     typingReplay: 'Hey th',
//   },
//   10700: {
//     textCompleted: 'Hey the',
//     typingReplay: 'Hey the',
//   },
//   12000: {
//     textCompleted: 'Hey the',
//     typingReplay: 'Hey thef',
//   },
//   13000: {
//     textCompleted: 'Hey the',
//     typingReplay: 'Hey thefs',
//   },
//   14000: {
//     textCompleted: 'Hey the',
//     typingReplay: 'Hey thef',
//   },
//   15000: {
//     textCompleted: 'Hey the',
//     typingReplay: 'Hey the',
//   },
//   19100: {
//     textCompleted: 'Hey ther',
//     typingReplay: 'Hey ther',
//   },
//   25000: {
//     textCompleted: 'Hey there',
//     typingReplay: 'Hey there',
//   },
//   25010: {
//     textCompleted: 'Hey there w',
//     typingReplay: 'Hey there w',
//   },
//   25020: {
//     textCompleted: 'Hey there wh',
//     typingReplay: 'Hey there wh',
//   },
//   25030: {
//     textCompleted: 'Hey there whe',
//     typingReplay: 'Hey there whe',
//   },
//   25040: {
//     textCompleted: 'Hey there when',
//     typingReplay: 'Hey there when',
//   },
//   25050: {
//     textCompleted: 'Hey there when ',
//     typingReplay: 'Hey there when ',
//   },
//   25060: {
//     textCompleted: 'Hey there when t',
//     typingReplay: 'Hey there when t',
//   },
//   25070: {
//     textCompleted: 'Hey there when th',
//     typingReplay: 'Hey there when th',
//   },
//   25080: {
//     textCompleted: 'Hey there when the',
//     typingReplay: 'Hey there when the',
//   },
//   25090: {
//     textCompleted: 'Hey there when the ',
//     typingReplay: 'Hey there when the ',
//   },
//   25100: {
//     textCompleted: 'Hey there when the t',
//     typingReplay: 'Hey there when the t',
//   },
//   25210: {
//     textCompleted: 'Hey there when the ti',
//     typingReplay: 'Hey there when the ti',
//   },
//   25320: {
//     textCompleted: 'Hey there when the tim',
//     typingReplay: 'Hey there when the tim',
//   },
//   25430: {
//     textCompleted: 'Hey there when the time',
//     typingReplay: 'Hey there when the time',
//   },
//   25540: {
//     textCompleted: 'Hey there when the time ',
//     typingReplay: 'Hey there when the time ',
//   },
//   25750: {
//     textCompleted: 'Hey there when the time i',
//     typingReplay: 'Hey there when the time i',
//   },
//   25960: {
//     textCompleted: 'Hey there when the time is',
//     typingReplay: 'Hey there when the time is',
//   },
//   26170: {
//     textCompleted: 'Hey there when the time is ',
//     typingReplay: 'Hey there when the time is ',
//   },
//   26180: {
//     textCompleted: 'Hey there when the time is u',
//     typingReplay: 'Hey there when the time is u',
//   },
//   26390: {
//     textCompleted: 'Hey there when the time is up',
//     typingReplay: 'Hey there when the time is up',
//   },
//   26400: {
//     textCompleted: 'Hey there when the time is up!',
//     typingReplay: 'Hey there when the time is up!',
//   },
// }

// when play it should play
// when pause it should pause

// when play and timer >= duration

// eslint-disable-next-line react/prop-types
export default function GameReplayOne({
  replayData,
  acceptedAtList,
  duration = 26400,
}) {
  console.log('replayData', replayData)
  console.log('duration', duration)
  const [timer, setTimer] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const intervalIdRef = useRef(null)
  const isOver = timer >= duration
  const [textCompleted, setTextCompleted] = useState('')
  const [typingReplay, setTypingReplay] = useState('')
  const { phrase } = useContext(gameBoardContext)

  const play = () => {
    setIsPlaying(true)
    intervalIdRef.current = window.setInterval(() => {
      setTimer((t) => t + 50)
      console.log('timer', timer)
    }, 50)
  }

  const pause = () => {
    setIsPlaying(false)
    window.clearInterval(intervalIdRef.current)
  }

  const handlePlayPause = () => {
    if (isPlaying) {
      pause()
    } else {
      play()
    }
  }

  const handleReset = () => {
    setTimer(0)
    play()
    setTextCompleted('')
    setTypingReplay('')
  }

  const handleSpanClick = (event, index) => {
    if (isPlaying) {
      pause()
    }
    const pos = getClickPosition(event)

    if (pos === -1) {
      const nextTimer = acceptedAtList[index]
      setTimer(nextTimer)
    } else {
      const nextTimer = acceptedAtList[index + 1]
      setTimer(nextTimer)
    }
  }

  // since no events/user actions in isOver are involved and we want synchronize the state with the timer (setInterval) that's why we are using useEffect here
  useEffect(() => {
    if (isOver) {
      pause()
    }
  }, [isOver])

  useEffect(() => {
    if (replayData?.get(timer)) {
      setTextCompleted(replayData.get(timer).textCompleted)
      setTypingReplay(replayData.get(timer).typingReplay)
    }
  }, [timer, replayData])

  if (!replayData || !phrase) {
    console.log('here')
    return null
  }

  return (
    <div className='mt-5'>
      <h3>Game Replay</h3>
      <div>
        <p className='py-2'>
          {phrase.split('').map((char, index) => {
            const isAccepted = index < textCompleted.length

            return (
              <span
                key={index}
                className={isAccepted ? 'text-purple-600' : 'text-gray-800'}
                onClick={(event) => handleSpanClick(event, index)}
              >
                {char}
              </span>
            )
          })}
        </p>
        <p className='py-2 h-10'>{typingReplay}</p>
      </div>

      <p>{formattedTimer(timer)}</p>
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
