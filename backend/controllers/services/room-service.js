const Room = require("../../models/Room")
class RoomService{
    async create(payload){
        const { roomType, topic, ownerId } = payload;
        const room = await Room.create({roomType, topic, ownerId, speakers: [ ownerId ]});
        return room;
    }
    async getAllRooms(types){
        const rooms = await Room.find({ roomType: { $in : types} }).populate('speakers').populate('ownerId').exec();
        return rooms;
    }
    async getRoom(roomId){
        
        const room = await Room.findOne({_id:roomId})
        
        return room;
    }
}

module.exports = new RoomService()