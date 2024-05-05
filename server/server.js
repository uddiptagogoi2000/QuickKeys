import express from 'express'
import pkg from 'pg'
const { Pool } = pkg
import { Server } from 'socket.io'
import { createServer } from 'http'
import cors from 'cors'

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'quickkeys',
  password: 'lol',
  port: '5432',
})

const app = express()
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5175',
    methods: ['GET', 'POST'],
  },
})

const rooms = {}

/*

type Rooms = {
	[roomId: string]: Room;
}

type Room = {
	players: Player[]
}

type Player = {
	hasCompleted: boolean;
	playerId: string;
	completedAt: number;
  progress: number;
}

*/

app.use(cors())

app.get('/', (req, res) => {
  res.status(200).json({ ok: true, message: 'Welcome to QuickKeys!' })
})

server.listen(3001, () => {
  console.log('Server is running on port 3001')
})

io.on('connection', (socket) => {
  socket.on('new-player', (player) => {
    // find a random room with less than 5 players
    // if found, join the room
    // if not, create a new room and join the room and wait for other players
  })

  socket.on('send-progress', (room, progress) => {
    // update the progress of the player in the room
    socket
      .to(room)
      .broadcast.emit(
        'progress' /*send the progress to all players in the room */,
        { progress }
      )
  })

  socket.on('disconnect', () => {
    // getPlayersRoom(socket)
    // get the player's room and delete the player from the room
    // decrease the player count in the room by 1
  })
})

/* 

function findAvailableRoom() {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM races WHERE players_count < 5 LIMIT 1'

    pool.query(query, (err, res) => {
      if (err) {
        console.error(err)
        reject(err)
        return
      }

      const result = res.rows[0]
      resolve(result)
    })
  })
}

function createNewRoom(socketId) {
  console.log('creating new room', socketId, typeof socketId)
  const query = `INSERT INTO races (roomid, players_count) VALUES ('${socketId}', 1)`

  pool.query(query, (err, res) => {
    if (err) {
      console.error(err)
      return
    }

    console.log('new room created', res)
  })
}

// app.get('/api/race/init', async (req, res) => {
//   // check if any room is available
//   // if available, connect client to the room or join the room
//   const room = await findAvailableRoom()

//   if (room) {
//     io.to(room.id).emit('new-player', { roomId: room.id });
//   } else {

//   }
//   // if not, create a new room and save it to the database
//   res.status(200).json({ ok: true, message: 'initiating a race' })
// })

function increasePlayerCount(roomId) {
  const query =
    'UPDATE races SET players_count = players_count + 1 WHERE roomid = $1'
  const values = [roomId]

  pool.query(query, values, (err, res) => {
    if (err) {
      console.error(err)
      return
    }

    console.log('player count increased', res)
  })
}

function decreasePlayerCount(roomId) {
  const query =
    'UPDATE races SET players_count = players_count - 1 WHERE roomid = $1'
  const values = [roomId]

  pool.query(query, values, (err, res) => {
    if (err) {
      console.error(err)
      return
    }

    console.log('player count decreased', res)
  })
}

// async function getAllData() {
//   const query = 'SELECT * FROM races'

//   const result = await pool.query(query)

//   return result.rows[0]
// }

io.on('connection', async (socket) => {
  socket.emit('connected', { id: socket.id })

  const room = await findAvailableRoom()
  // const data = await getAllData()

  console.log('room found', room)

  if (room) {
    // join the socket to the room
    socket.join(room.roomid)

    increasePlayerCount(room.roomid)

    io.to(room.roomid).emit('new-player', {
      roomId: room.roomid,
      playerId: socket.id,
      playersCount: room.players_count,
    })
  } else {
    // insert into values (roomid, is_available, players_count) values (${socket.id}, true, 1);
    createNewRoom(socket.id)
  }

  socket.on('disconnect', () => {
    console.log('user disconnected')

    if (room) {
      decreasePlayerCount(room.roomid)
    }
  })
})
*/
