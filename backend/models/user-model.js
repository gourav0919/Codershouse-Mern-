const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    phone: {
      type: String,
      required: true,
    },
    activated: {
      type: Boolean,
      required: false,
      default: false,
    },
    name: {
      type: String,
      required: false,
    },
    avatar: {
      type: String,
      required: false,
      // https://mongoosejs.com/docs/tutorials/getters-setters.html see this article mainly getters are used to convert a mongodb data to some another form when user want it but in the actual db the data is store as it is not as we do in the getters
      get: (avatar) => {
        // It automaticlly adds the / after the url in the development
        return `${process.env.BASE_URL}${avatar}`;
      },
    },
  },
  //   This Timestamp will add the Created and updated at timestamps in our Database
  {
    timestamps: true,
    toJSON: { getters: true },
  }
);

// The third parameter here specifies the collection name in which all of the models is going to store
module.exports = mongoose.model("User", userSchema, "users");
