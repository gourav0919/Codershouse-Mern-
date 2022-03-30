const RoomModel = require("../models/room-model");

class RoomService {
  // payload :- { roomName,  roomType, ownerId: req.user.id, }
  async createRoom(payload) {
    const { roomName, roomType, ownerId } = payload;

    // now what we have to do we have to create the room and store it to db and for now we are not implementing the functionality of adding speakers. we thinking that the person who create the room is the speaker only
    const room = await RoomModel.create({
      topic: roomName,
      roomType,
      ownerId,
      speakers: [ownerId],
    });
    return room;
  }

  // Making a service for checking if a user is already enrolled in a room so he/she is not able to join or create a new room
  // This is the idea we can see it later on when we have the user list which user is joined and which one is speaker then we can be able to implement this functionality and able to find it easily
  //   async isUserInAnyRoom(userId){
  //       const room = await roomModel.findOne({ownerId : userId});
  //   }

  // now our roomType is the array
  async getAllRooms(types) {
    // We have 3 types of room :- open, social and private
    // We have to pass the room Type filter to get the specified type of room
    // We pass the array and now it can find all of the query result according to the array elements
    // here we use the .populate method to populate the refrenced schema
    // If we use .exec then it return a promise if we did not use it then it return a thenable which is not a promise but behaves like a promise
    const allRooms = await RoomModel.find({ roomType: { $in: types } })
      .populate("speakers")
      .populate("ownerId")
      .exec();
    return allRooms;
  }

  // Getting a single room
  async getRoom(roomId) {
    // here i did not want to populate the owner Id so we did not use the populate
    const singleRoom = await RoomModel.findById(roomId);
    return singleRoom;
  }
}

module.exports = new RoomService();
