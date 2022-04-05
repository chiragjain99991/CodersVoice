const roomService = require("./services/room-service")
const RoomDto = require("../dtos/room-dto")

class RoomController{
    async createRoom(req, res) {

        const { roomType, topic } = req.body
        const ownerId = req.user._id
        if(!roomType || !topic){
            return res.status(400).send({ message:"all fields are required"})
        }

        const room = await roomService.create({
            roomType, 
            topic,
            ownerId
        })

        console.log("rooom", room)

        return res.status(200).json(new RoomDto(room))
        
    }

    async getAllRoom(req, res){
        const rooms = await roomService.getAllRooms(['open']);
        const allRooms = rooms.map((room) => new RoomDto(room))
        return res.status(200).json(allRooms);
    }

    async show(req, res){
        const room = await roomService.getRoom(req.params.roomId);
        return res.status(200).json(room);
    }
}

module.exports = new RoomController()