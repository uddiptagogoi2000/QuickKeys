import { useState, useEffect } from 'react'

const Timer = () => {
  const [time, setTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [endTime, setEndTime] = useState(5) // Set the end time in seconds

  useEffect(() => {
    let interval

    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1)

        if (time === endTime) {
          setIsRunning(false)
        }
      }, 1000)
      console.log('interval', interval)
    } else {
      clearInterval(interval)
      console.log('cleared interval', interval)
    }

    return () => {
      clearInterval(interval)
    }
  }, [isRunning, time, endTime])

  const handlePlayPause = () => {
    setIsRunning((prevIsRunning) => !prevIsRunning)
  }

  const handleReset = () => {
    setTime(0)
    setIsRunning(false)
  }

  return (
    <div>
      <h1>{formatTime(time)}</h1>
      <button onClick={handlePlayPause}>{isRunning ? 'Pause' : 'Play'}</button>
      <button onClick={handleReset}>Reset</button>
    </div>
  )
}

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(
    remainingSeconds
  ).padStart(2, '0')}`
}

export default Timer
