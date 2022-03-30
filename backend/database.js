const mongoose = require("mongoose");

const databaseConnection = () => {
  const dbUri = process.env.DB_URI || "mongodb://localhost:27017/codershouse";
  mongoose
    .connect(dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((data) => {
      console.log(
        `MongoDb Database Connected to the Server : ${data.connection.host}`
      );
    })
    .catch((err) => {
      console.log(`Some Database Connection Error Occured :- ${err}`);
    });
};

module.exports = databaseConnection;
