class RoomDto {
  topic;
  roomType;
  ownerId;
  roomId;
  speakers;
  createdAt;

  constructor(room) {
    this.topic = room.topic;
    this.roomType = room.roomType;
    this.ownerId = room.ownerId;
    this.roomId = room._id;
    this.speakers = room.speakers;
    this.createdAt = room.createdAt;
  }
}

// here we did not create the instance because here we are providing different data every time and using it the different objects
module.exports = RoomDto;
