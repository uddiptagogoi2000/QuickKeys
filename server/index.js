import express from 'express'
import { createServer, get } from 'http'
import { Server } from 'socket.io'

const app = express()
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})

const rooms = {}

app.get('/', (req, res) => {
  res.status(200).json({ ok: true, message: 'Welcome to QuickKeys!' })
})

server.listen(3001, () => {
  console.log('Server is running on port 3001')
})

io.on('connection', (socket) => {
  socket.on('new-player', (player) => {
    console.log({ player })
    const availableRoom = findAvailableRoom()

    if (availableRoom) {
      // Join existing room
      joinRoom(socket, availableRoom, player)
      socket.emit('room-joined', availableRoom)
      io.to(availableRoom).emit('progress', {
        players: rooms[availableRoom].players,
      })
    } else {
      // Create new room
      const newRoomId = createNewRoom()
      joinRoom(socket, newRoomId, player)
      socket.emit('room-joined', newRoomId)
      io.to(newRoomId).emit('progress', { players: rooms[newRoomId].players })
    }

    console.log('rooms', JSON.stringify(rooms, null, 2))
    console.log('roomId', getPlayerRoom(socket.id))
  })

  socket.on('send-progress', (room, progress) => {
    // Update the progress of the player in the room

    console.log({ room, progress })
    updatePlayerProgress(socket.id, room, progress)

    // Broadcast the progress to all players in the room
    io.to(room).emit('progress', { players: rooms[room].players })
  })

  socket.on('disconnect', () => {
    const playerRoom = getPlayerRoom(socket.id)

    if (playerRoom) {
      // Delete the player from the room
      deletePlayer(socket.id, playerRoom)

      // Notify other players about the disconnection
      io.to(playerRoom).emit('player-disconnected', { playerId: socket.id })
    }

    console.log('rooms', JSON.stringify(rooms, null, 2))
  })
})

// Function to find an available room with less than 5 players
function findAvailableRoom() {
  for (const roomId in rooms) {
    if (rooms[roomId].players.length < 5) {
      return roomId
    }
  }
  return null
}

// Function to create a new room
function createNewRoom() {
  const newRoomId = generateRoomId()
  rooms[newRoomId] = { players: [] }
  return newRoomId
}

// Function to join a room
function joinRoom(socket, roomId, player) {
  socket.join(roomId)
  const colors = ['green', 'red', 'violet', 'blue']
  const color = getAvailableColor(roomId, colors)
  const newPlayer = new Player(socket.id, player.name, color, 0, 0)
  rooms[roomId].players.push(newPlayer)
}

function getAvailableColor(roomId, colors) {
  const playersColor = rooms[roomId].players.map((player) => player.color)
  const availableColor = colors.find((color) => !playersColor.includes(color))
  return availableColor
}

function Player(id, name, color, progress, wpm) {
  this.id = id
  this.name = name
  this.color = color
  this.progress = progress
  this.wpm = wpm
}

// Function to generate a random room ID (you may implement this based on your requirements)
function generateRoomId() {
  return Math.random().toString(36).slice(2, 9)
}

// Function to update the progress of a player in a room
function updatePlayerProgress(playerId, roomId, progress) {
  console.log({ playerId, roomId, progress })

  const playerIndex = rooms[roomId].players.findIndex(
    (player) => player.id === playerId
  )

  console.log({ playerIndex })
  if (playerIndex !== -1) {
    rooms[roomId].players[playerIndex].progress = progress
  }

  console.log('rooms updated', JSON.stringify(rooms, null, 2))
}

// Function to get the room of a player
function getPlayerRoom(playerId) {
  for (const roomId in rooms) {
    const playerIndex = rooms[roomId].players.findIndex(
      (player) => player.playerId === playerId
    )
    if (playerIndex !== -1) {
      return roomId
    }
  }
  return null
}

// Function to delete a player from a room
function deletePlayer(playerId, roomId) {
  rooms[roomId].players = rooms[roomId].players.filter(
    (player) => player.playerId !== playerId
  )
}
