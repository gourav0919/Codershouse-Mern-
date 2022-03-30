import { io } from "socket.io-client";

// from this function our io is going to return
// This function do the client initialisation of the socket for the client
export const socketInit = () => {
  const options = {
    forceNew: true,
    reconnectionAttempts: "Infinity",
    timeout: 10000,
    transports: ["websocket"],
  };

  // This we do because our server is running on the different domain so we have to pass the domain
  return io("http://localhost:5500", options);
};
