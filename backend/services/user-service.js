const UserModel = require("../models/user-model");

class UserService {
  // Filter we pass as a object with the field which corresponding you want to find a user
  async findUser(filter) {
    const user = await UserModel.findOne(filter);
    return user;
  }

  async createUser(data) {
    const user = await UserModel.create(data);
    return user;
  }

  async findUserByIdAndUpdate(id, data) {
    const user = await UserModel.findByIdAndUpdate(id, data);
    return user;
  }
}

module.exports = new UserService();
