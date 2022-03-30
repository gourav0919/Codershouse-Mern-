const roomService = require("../services/room-service");
const RoomDto = require("../dtos/room-dto");

class RoomsController {
  async createRoom(req, res) {
    const { roomName, roomType } = req.body;

    // Basic Validation
    if (!roomName || !roomType) {
      return res.status(400).json({
        success: false,
        message: "All fields are Required.",
      });
    }

    try {
      // If no validation error then create a room
      // we have the ownerId means who create the room which logged in user create the room as you know that we pass a middleware which get the user(payload) via the verifyAccessToken and then use this payload to add it to .user field payload have only id field
      const room = await roomService.createRoom({
        roomName,
        roomType,
        ownerId: req.user.id,
      });

      const roomDto = new RoomDto(room);

      return res.status(200).json({
        success: true,
        message: "Room Created Successfully",
        room: roomDto,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error.",
      });
    }
  }

  // Firstly too this is a get request so it can not contain any data its work is very very simple just to give the list of all available open rooms as i think
  // now it is taking the public rooms from the database it self so there is no need to hardcode it
  async getAllPublicRooms(req, res) {
    try {
      // using a room service for getting all of the rooms :- getAllRooms()
      // here we are passing array so that in future if we have to find multiple types of rooms so we can find it easily
      const rooms = await roomService.getAllRooms(["open"]);

      // now sending the response to the user according to the user Dto
      // here we know that in the future we are going to use the concept of the pagination so we can easily use the room DTO to map it
      const allPublicRooms = rooms.map((room) => {
        return new RoomDto(room);
      });

      // The one problem is this now we are also getting the roomId and the ownerId which is a security issue and we can not be able to give this to everyone

      return res.status(200).json({
        success: true,
        rooms: allPublicRooms,
        message: "All Rooms List is here.",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message:
          "Some Internal Server Error Occured can not able to fetch all public Rooms",
      });
    }
  }

  async getSingleRoom(req, res) {
    try {
      const { roomId } = req.params;
      const room = await roomService.getRoom(roomId);

      const roomDto = new RoomDto(room);

      return res.status(200).json({
        success: true,
        room: roomDto,
        message: "Your Particular Room Details.",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message:
          "Some Internal Server Error Occured can not able to fetch that particular Room",
      });
    }
  }
}

// we are exporting it by making a singleton instance
module.exports = new RoomsController();
