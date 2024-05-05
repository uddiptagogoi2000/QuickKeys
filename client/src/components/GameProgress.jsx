/* eslint-disable react/prop-types */
import { useContext, useEffect, useRef } from 'react'
import { getAvatar } from '../utils/helpers'
import gameBoardContext from './gameBoardContext'

// const players = [
//   {
//     id: 1,
//     name: 'Player 1',
//     progress: 55,
//     wpm: 20,
//     color: 'green',
//   },
//   {
//     id: 2,
//     name: 'Player 2',
//     progress: 22,
//     wpm: 10,
//     color: 'red',
//   },
//   {
//     id: 3,
//     name: 'Player 3',
//     progress: 0,
//     wpm: 0,
//     color: 'violet',
//   },
//   {
//     id: 4,
//     name: 'Player 4',
//     progress: 100,
//     wpm: 30,
//     color: 'blue',
//   },
// ]

const Progress = ({ name, progress, wpm, color }) => {
  const avatar = getAvatar(color)
  const progressRef = useRef(null)
  const avatarRef = useRef(null)

  useEffect(() => {
    if (progressRef.current && avatarRef.current) {
      const scaledProgressForUI =
        (progressRef.current.offsetWidth * progress) / 100 -
        avatarRef.current.offsetWidth

      avatarRef.current.style.transform = `translateX(${scaledProgressForUI}px)`

      console.log({ scaledProgressForUI })
    }
  }, [progress])

  return (
    <div className='border-b-2 border-dashed pl-20 w-[90%] relative'>
      <div ref={progressRef} className='relative h-10'>
        <span ref={avatarRef} className='absolute bottom-0'>
          {name}
          {avatar}
        </span>
      </div>
      <div className='absolute -right-20 bottom-0 bg-white'>
        <span>{wpm} wpm</span>
      </div>
    </div>
  )
}

const GameProgress = () => {
  const { players } = useContext(gameBoardContext)

  return (
    <div>
      {players?.map((player, index) => (
        <div key={index}>
          <Progress
            id={player.id}
            color={player.color}
            name={player.name}
            progress={player.progress}
            wpm={player.wpm}
          />
        </div>
      ))}
    </div>
  )
}

export default GameProgress
