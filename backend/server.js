const dotenv = require("dotenv");
const express = require("express");
const router = require("./routes");
const app = express();
const databaseConnection = require("./database");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const ACTIONS = require("./actions");
const server = require("http").createServer(app);
const pathPac = require("path");

// This will give us the absolute path for the current directory
const __dirname1 = pathPac.resolve();
// console.log(__dirname1);

dotenv.config();
// dotenv.config({ path: "./.env.dev" });
// dotenv.config({ path: pathPac.join(__dirname1, "/.env") });

const io = require("socket.io")(server, {
  cors: {
    origin: process.env.FRONT_URL,
    methods: ["GET", "POST"],
  },
});

const port = process.env.PORT || 5500;
app.use(
  // Because we have to deal with the photos so we need to increase the size
  express.json({
    limit: "8mb",
  })
);

// Adding cookie parser
app.use(cookieParser());

// making the storage folder as static
console.log(pathPac.join(__dirname1, "storage/avatar-images"));

// All of the things are working fine there is just the error of the /
app.use(
  "/storage/avatar-images",
  express.static(pathPac.join(__dirname1, "backend/storage/avatar-images"))
);
// app.use("/storage/avatar-images", express.static("storage/avatar-images"));

// In this way we are able to on the cors middleware in the express
const corsOption = {
  credentials: true,
  origin: [process.env.FRONT_URL],
};
app.use(cors(corsOption));

// This is for we can use the router to specify the routes of our backend
app.use(router);

if (process.env.NODE_ENV === "production") {
  // serving the build folder as the static folder of the frontend
  // this dirname1 is giving me the absolute path of the current directory but in real it is not giving that which i wanted
  // Because we have to serve it as the static
  app.use(
    "/",
    express.static(pathPac.join(__dirname1, "backend/frontend/build"))
  );

  app.get("*", (req, res) => {
    res.sendFile(
      pathPac.join(__dirname1, "backend", "frontend", "build", "index.html")
    );
  });
} else {
  // Default route you can even put this in the router also
  app.get("/", (req, res) => {
    res.send("I am Gourav Khurana now i am making the Codershouse Project.");
  });
}

// Connecting with the Database
databaseConnection();

// Socket user mapping object in this we are mapping user with the socket id of the user
const socketUserMapping = {};

// Sockets logic
io.on("connection", (socket) => {
  // Join request always coming from the frontend
  socket.on(ACTIONS.JOIN, ({ roomId, user }) => {
    // we are making the room same as the roomId in the adapter of the socket
    socketUserMapping[socket.id] = user;

    // Room is a special feature in the socket.io
    const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);

    // we have to do it for all of the clients
    clients.forEach((joinedClientSocket) => {
      // Sending event to both of the browsers to add this socket as a peer to each other so that connection can start
      io.to(joinedClientSocket).emit(ACTIONS.ADD_PEER, {
        peerId: socket.id,
        createOffer: false,
        user,
      });

      socket.emit(ACTIONS.ADD_PEER, {
        peerId: joinedClientSocket,
        createOffer: true,
        user: socketUserMapping[joinedClientSocket],
      });
    });

    socket.join(roomId);
  });

  // handle relay ice
  socket.on(ACTIONS.RELAY_ICE, ({ peerId, icecandidate }) => {
    io.to(peerId).emit(ACTIONS.ICE_CANDIDATE, {
      peerId: socket.id,
      icecandidate,
    });
  });

  // handle relay sdp offer or answer
  socket.on(ACTIONS.RELAY_SDP, ({ peerId, sessionDescription }) => {
    io.to(peerId).emit(ACTIONS.SESSION_DESCRIPTION, {
      peerId: socket.id,
      sessionDescription,
    });
  });

  // Handle Mute
  socket.on(ACTIONS.MUTE, ({ roomId, userId }) => {
    // even we did not need this
    const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
    clients.forEach((clientId) => {
      // If we are doing in this way then it is emit to the client which send this event as well
      io.to(clientId).emit(ACTIONS.MUTE, { peerId: socket.id, userId });
    });
  });

  // Handle unmute
  socket.on(ACTIONS.UNMUTE, ({ roomId, userId }) => {
    const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
    clients.forEach((clientId) => {
      io.to(clientId).emit(ACTIONS.UNMUTE, { peerId: socket.id, userId });
    });
  });

  // handling mute info but the reason we did not know
  // socket.on(ACTIONS.MUTE_INFO, ({ userId, roomId, isMute }) => {
  //   const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
  //   clients.forEach((clientId) => {
  //     if (clientId !== socket.id) {
  //       console.log("mute info");
  //       io.to(clientId).emit(ACTIONS.MUTE_INFO, {
  //         userId,
  //         isMute,
  //       });
  //     }
  //   });
  // });

  // leaving the room
  const leaveRoom = ({ roomId }) => {
    // Firstly socket have to leave that specific roomId room
    socket.leave(roomId);

    const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);

    clients.forEach((clientId) => {
      // now we have to remove from every client
      io.to(clientId).emit(ACTIONS.REMOVE_PEER, {
        peerId: socket.id,
        userId: socketUserMapping[socket.id]
          ? socketUserMapping[socket.id].id
          : null,
      });

      // now we have to remove ourself
      socket.emit(ACTIONS.REMOVE_PEER, {
        peerId: clientId,
        userId: socketUserMapping[clientId]
          ? socketUserMapping[clientId].id
          : null,
      });
    });

    // we are cleaning from the every position so that memory leak is not possible
    delete socketUserMapping[socket.id];
  };

  // If user emit a leave event from the
  socket.on(ACTIONS.LEAVE, leaveRoom);

  // if user in any case close the browser directly then the event of disconnecting will occur first which will run the leave room function
  socket.on("disconnecting", leaveRoom);
});

// now we are making a server which is listening to our express so now we have to listen that server
server.listen(port, () => {
  console.log(`Example port listening at : ${port}`);
});
