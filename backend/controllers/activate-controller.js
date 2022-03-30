const { findUser } = require("../services/user-service");
const Jimp = require("jimp");
const path = require("path");
const UserDto = require("../dtos/user-dto");

class ActivateController {
  async activateUser(req, res) {
    const { name, avatar } = req.body;

    if (!name || !avatar) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    // by doing this we store our avatar in the storage/avatarImages

    // now here we are getting base64 string of image so we have to store this image into our file system
    // inside this we use the regex with the replace method of string
    const buffer = Buffer.from(
      avatar.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""),
      "base64"
    );

    // creating an random image path
    const imagePath = `${Date.now()}-${Math.round(Math.random() * 1e9)}.png`;
    // 1647320757098-946402728.png

    try {
      const jimpResponse = await Jimp.read(buffer);

      // here we are storing the image in a folder name as storage and providing it an random path
      jimpResponse
        .resize(150, Jimp.AUTO)
        .write(
          path.resolve(__dirname, `../storage/avatar-images/${imagePath}`)
        );
      // auto is for maintaining the aspect ratio of the picture.
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Could not process the image.",
      });
    }

    // now setting the activated field of database as true and setting the name and avatar url in the database.
    const userId = req.user.id;
    try {
      const user = await findUser({
        _id: userId,
      });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found.",
        });
      }

      // if user is present then setting the fields and save it
      user.activated = true;
      user.name = name;
      user.avatar = `/storage/avatar-images/${imagePath}`;
      user.save();

      return res.status(200).json({
        success: true,
        user: new UserDto(user),
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong Database Error ",
      });
    }
  }
}

module.exports = new ActivateController();
