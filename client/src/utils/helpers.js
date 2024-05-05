export const calculateProgress = (
  typedWordsLength,
  totalWordsLength,
  scaleFactor = 100
) => {
  const progressPercent = (typedWordsLength / totalWordsLength) * 100
  const scaledProgress = Math.trunc((progressPercent / 100) * scaleFactor)

  return scaledProgress
}

export const sendProgressToServer = (socket, room, progress) => {
  socket.emit('send-progress', room, progress)
  console.log('progress sent', progress)
}

export const getAvatar = (color) => {
  switch (color) {
    case 'green':
      return '🐸'
    case 'red':
      return '🦀'
    case 'violet':
      return '🦄'
    case 'blue':
      return '🐳'
    default:
      return '👽'
  }
}

export function formattedTimer(milliseconds) {
  console.log({ milliseconds })
  // Convert milliseconds to seconds
  let totalSeconds = Math.floor(milliseconds / 1000)

  // Calculate minutes and seconds
  let minutes = Math.floor(totalSeconds / 60)
  let seconds = totalSeconds % 60

  // Add leading zeros if necessary
  minutes = minutes < 10 ? '0' + minutes : minutes
  seconds = seconds < 10 ? '0' + seconds : seconds

  // Return the formatted result
  return `${minutes}:${seconds}`
}

export function getReplayDuration(record) {
  return Array.from(record.keys()).pop()
}

export function getAcceptedTimings(recordMap) {
  const indexWiseTimes = []
  for (const [key, value] of recordMap) {
    const k = value.textCompleted.length
    const isBothSame = value.textCompleted === value.typingReplay
    if (indexWiseTimes[k] === undefined && isBothSame) {
      indexWiseTimes.push(key)
    }
  }

  console.log({ indexWiseTimes })

  return indexWiseTimes
}

export function getClickPosition(event) {
  const rect = event.target.getBoundingClientRect()
  const clickPosition = event.clientX - rect.left
  const halfWidth = rect.width / 2

  // Return 0 if the click is on the right side of the span otherwise -1 which means left
  // -1 means left, 0 means current element
  if (clickPosition < halfWidth) {
    return -1
  } else {
    return 0
  }
}
