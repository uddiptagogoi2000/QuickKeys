import { createContext } from 'react'

const gameBoardContext = createContext({
  socket: null,
  isPlaying: false,
  roomId: null,
  players: null,
  beginRacing: false,
  handleBeginRacing: () => {},
  onGameOver: () => {},
  phrase:
    'High in the mountains, where the air is crisp and the silence profound, a lone eagle soared gracefully against the azure sky.',
})

export default gameBoardContext
