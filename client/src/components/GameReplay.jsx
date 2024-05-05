import { useRef, useState } from 'react'

// eslint-disable-next-line react/prop-types
export default function GameReplay({ duration = 5000 }) {
  // const [play, setPlay] = useState(false)
  const [timer, setTimer] = useState(0)
  const play = useRef({
    isPlaying: false,
    intervalID: null,
  })

  let { isPlaying, intervalID } = play.current

  // if (timer >= duration) {
  //   setPlay(false)
  // }

  // const isOver = timer >= duration

  // useEffect(() => {
  //   // if (isOver) {
  //   //   console.log('is over')
  //   //   setPlay(false)
  //   // }
  //   let intervalID

  //   if (play) {
  //     intervalID = window.setInterval(() => {
  //       setTimer((t) => {
  //         if (t >= duration) {
  //           setPlay(false)
  //           return duration
  //         }
  //         return t + 1000
  //       })
  //       console.log({ play })
  //     }, 1000)
  //   }

  //   return () => {
  //     if (intervalID) {
  //       window.clearInterval(intervalID)
  //       console.log('cleared interval')
  //     }
  //   }
  // }, [play, duration])

  const handlePlay = () => {
    if (!isPlaying.current) {
      if (timer >= duration) {
        setTimer(0)
      }
      intervalID = window.setInterval(() => {
        setTimer((t) => {
          if (t >= duration) {
            isPlaying = false
            window.clearInterval(intervalID)
            console.log('cleared interval')
            return duration
          }
          return t + 1000
        })
      }, 1000)
    }
  }

  const handlePause = () => {
    isPlaying = false
    window.clearInterval(intervalID)
    intervalID = null
  }

  return (
    <div className='mt-5'>
      <h3>Game Replay</h3>
      <p>{timer}</p>

      <div className='flex gap-2'>
        <button
          onClick={handlePlay}
          className='px-3 border-2 border-purple-900 rounded-md'
        >
          Play
        </button>
        <button
          onClick={handlePause}
          className='px-3 border-2 border-purple-900 rounded-md'
        >
          Pause
        </button>
      </div>
    </div>
  )
}
