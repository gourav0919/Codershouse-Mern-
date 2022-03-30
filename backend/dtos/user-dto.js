class UserDto {
  id;
  phone;
  name;
  avatar;
  activated;
  createdAt;

  constructor(user) {
    this.id = user._id;
    this.phone = user.phone;
    this.name = user.name ? `${user.name}` : null;
    // We removed this because we use the getters concept in the usermodel itself which add the baseurl to the avatar url first and then store the full url in the backend database
    // this.avatar = user.avatar ? `${process.env.BASE_URL}${user.avatar}` : null;
    this.avatar = user.avatar;
    this.activated = user.activated;
    this.createdAt = user.createdAt;
  }
}

// here we are not sending the object here we directly sending the class
// now we are sending the class so firstly we have to make a object to use this class anywhere.
module.exports = UserDto;
