import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import GameBoard from './GameBoard'
import { io } from 'socket.io-client'
import gameBoardContext from './gameBoardContext'
import GameProgress from './GameProgress'
import GameTimer from './GameTimer'
import GameCountdown from './GameCountdown'
import GameReplayOne from './GameReplayOne'
import { getAcceptedTimings, getReplayDuration } from '../utils/helpers'

const GameBoardContainer = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  // const socketRef = useRef(null)
  const [roomId, setRoomId] = useState(null)
  const [playersData, setPlayersData] = useState(null)
  const [beginRacing, setBeginRacing] = useState(null)
  const [isGameOver, setIsGameOver] = useState(false)
  const [duration, setDuration] = useState(0)
  const typingRecordRef = useRef(new Map())
  const [textAcceptedAtList, setTextAcceptedAtList] = useState([])

  // todo: array using the typingRecord Map that will store index wise times
  // 1. create an array to store times when the user completed the text
  // meaning, when the text accepted for the first time.
  // at that tiime, both completed text and typing text should be same

  // onclick on an element / char in the replay, get the index of the char and then get the time from the array

  const handleGameOver = (isOver) => {
    setIsGameOver(isOver)
    console.log('handle game over called')
  }

  console.log({ isGameOver })

  const handleSetRecord = (time, completed, inputText) => {
    const typingRecord = typingRecordRef.current

    console.log({ time, completed, inputText })

    typingRecord.set(time, {
      textCompleted: completed,
      typingReplay: inputText,
    })
  }

  const socket = useMemo(() => io('http://localhost:3001'), [])
  console.log({ socket })

  const handleStartGame = () => {
    setIsPlaying(true)
    socket.emit('new-player', { name: 'Guest' })
  }

  const handleStopGame = () => {
    setIsPlaying(false)
    if (socket) {
      socket.disconnect()
    }
  }

  const handleBeginRacing = useCallback((begin) => {
    setBeginRacing(begin)
  }, [])

  useEffect(() => {
    if (isGameOver) {
      console.log('game over called')
      const duration = getReplayDuration(typingRecordRef.current)
      const nextTextAcceptedAtList = getAcceptedTimings(typingRecordRef.current)
      console.log('list', nextTextAcceptedAtList)
      setDuration(duration)
      setTextAcceptedAtList(nextTextAcceptedAtList)
    }
  }, [isGameOver])

  useEffect(() => {
    if (socket) {
      socket.on('connect', () => {
        console.log('connected to server', socket.id)
      })
      socket.on('new-player', (data) => {
        console.log('new player', data)
      })

      socket.on('room-joined', (roomId) => {
        console.log('room joined', roomId)
        setRoomId(roomId)
      })

      socket.on('progress', (data) => {
        console.log('progress fdfhdfd', data)
        setPlayersData(data.players)
      })

      socket.on('disconnect', () => {
        console.log('disconnected')
      })
    }

    return () => {
      if (socket) {
        socket.disconnect()
      }
    }
  }, [socket])

  if (!socket) {
    return null
  }

  return (
    <gameBoardContext.Provider
      value={{
        isPlaying,
        beginRacing,
        handleBeginRacing,
        socket,
        roomId,
        players: playersData,
        onGameOver: handleGameOver,
        phrase:
          'High in the mountains, where the air is crisp and the silence profound, a lone eagle soared gracefully against the azure sky.',
      }}
    >
      <div className='border-2 px-5 py-2 border-purple-500 rounded-2xl'>
        {isPlaying ? (
          <div className='relative'>
            <GameCountdown />
            <GameTimer />
            <GameProgress />
            <GameBoard onRecord={handleSetRecord} />
            <button
              onClick={handleStopGame}
              className='border-2 border-purple-500 px-4 py-2 rounded-md mt-4'
            >
              Leave Race
            </button>
          </div>
        ) : (
          <button
            onClick={handleStartGame}
            className='border-2 border-purple-500 px-4 py-2 rounded-md'
          >
            Enter a Typing Race
          </button>
        )}
        {isGameOver && (
          <GameReplayOne
            replayData={typingRecordRef.current}
            duration={duration}
            acceptedAtList={textAcceptedAtList}
          />
        )}
      </div>
    </gameBoardContext.Provider>
  )
}

export default GameBoardContainer
