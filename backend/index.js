require('dotenv').config()
let express = require('express')
let app = express();
const Dbconnect = require('./database')
const PORT = process.env.PORT || 5500
const router = require('./routes/routes')
const cors = require('cors')
const cookieParser = require('cookie-parser');
const ACTIONS = require("./actions")
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
})

Dbconnect();



app.use('/storage', express.static('storage'));
app.use(express.json({ limit: '8mb'}))
app.use(cookieParser())

const corsOption = {
    origin:["http://localhost:3000"],
    credentials:true
}
app.use(cors(corsOption))



app.get('/',(req,res)=>{
    res.send('hello from pitch please')
});

app.use('/',router)

const socketUserMapping = {

}

io.on('connection', (socket)=>{
    // console.log('new connection', socket.id)

    socket.on(ACTIONS.JOIN, ({roomId, user})=>{
        socketUserMapping[socket.id] = user;
        console.log(roomId, user)
        const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || [])
        console.log(clients)
        clients.forEach(clientId => {
            io.to(clientId).emit(ACTIONS.ADD_PEER,{
                peerId: socket.id,
                createOffer: false,
                user
            })

            socket.emit(ACTIONS.ADD_PEER,{
                peerId: clientId,
                createOffer: true,
                user: socketUserMapping[clientId]
            });
        })

        console.log('socketUserMapping',socketUserMapping)

        

        socket.join(roomId)

        
        console.log(Array.from(io.sockets.adapter.rooms.get(roomId)))

    })

    socket.on(ACTIONS.MUTE,({roomId, userId})=>{
        console.log('muteee',userId )
        const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
        clients.forEach(clientId => {
            io.to(clientId).emit(ACTIONS.MUTE,{peerId: socket.id, userId})
        })
    })

    socket.on(ACTIONS.UNMUTE,({roomId, userId})=>{
        console.log('unnmuteee',userId )
        const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
        clients.forEach(clientId => {
            io.to(clientId).emit(ACTIONS.UNMUTE,{peerId: socket.id, userId})
        })
    })

    socket.on(ACTIONS.MUTE_INFO, ({ userId, roomId, isMute }) => {
        const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
        clients.forEach((clientId) => {
            if (clientId !== socket.id) {
                console.log('mute info');
                io.to(clientId).emit(ACTIONS.MUTE_INFO, {
                    userId,
                    isMute,
                });
            }
        });
    });


    //Handle Relay ice
    socket.on(ACTIONS.RELAY_ICE,({peerId, icecandidate})=>{
        io.to(peerId).emit(ACTIONS.ICE_CANDIDATE,{ peerId: socket.id, icecandidate })
    });

    socket.on(ACTIONS.RELAY_SDP,({peerId, sessionDescription})=>{
        io.to(peerId).emit(ACTIONS.SESSION_DESCRIPTION,{ peerId: socket.id, sessionDescription })
    })

    const leaveRoom = ({roomId}) =>{
        const {rooms} = socket;
        Array.from(rooms).forEach(roomId => {
            const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || [])
            clients.forEach(clientId => {
                io.to(clientId).emit(ACTIONS.REMOVE_PEER,{peerId: socket.id, userId: socketUserMapping[socket.id]?._id})

                socket.emit(ACTIONS.REMOVE_PEER, {peerId: clientId, userId: socketUserMapping[clientId]?._id})
            })

            socket.leave(roomId);

            
        })

        delete socketUserMapping[socket.id];
    }


    // remove peer
    socket.on(ACTIONS.LEAVE,leaveRoom);
    socket.on('disconnecting', leaveRoom)

    
})

server.listen(PORT,()=>{
    console.log('server started')
})