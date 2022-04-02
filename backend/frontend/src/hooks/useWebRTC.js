import { useRef, useCallback, useEffect } from "react";
import { useStateWithCallback } from "./useStateWithCallback";
import { socketInit } from "../socket";
import { ACTIONS } from "../actions";
import freeice from "freeice";

export const useWebRTC = (roomId, user) => {
  const [clients, setClients] = useStateWithCallback([]);
  const audioElements = useRef({}); // use userId
  const connections = useRef({});
  const localMediaStream = useRef(null);
  const socket = useRef(null);
  const clientsRef = useRef([]);

  useEffect(() => {
    clientsRef.current = clients;
  }, [clients]);

  useEffect(() => {
    const allConnections = async () => {
      // Handler Functions
      // The work of this function is to start the capturing of the audio
      const startCapture = async () => {
        localMediaStream.current = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
      };

      const handleNewPeer = async ({
        peerId,
        createOffer,
        user: remoteUser,
      }) => {
        if (peerId in connections.current) {
          return console.warn(
            `You are already connected with ${peerId} (${user.name})`
          );
        }

        connections.current[peerId] = new RTCPeerConnection({
          iceServers: freeice(),
        });

        connections.current[peerId].onicecandidate = (event) => {
          socket.current.emit(ACTIONS.RELAY_ICE, {
            peerId,
            icecandidate: event.candidate,
          });
        };

        connections.current[peerId].ontrack = ({ streams: [remoteStream] }) => {
          addNewClient({ ...remoteUser, muted: true }, () => {
            // mute info for no reason did not know
            // get current users mute info
            // const currentUser = clientsRef.current.find(
            //   (client) => client.id === user.id
            // );
            // if (currentUser) {
            //   socket.current.emit(ACTIONS.MUTE_INFO, {
            //     userId: user.id,
            //     roomId,
            //     isMute: currentUser.muted,
            //   });
            // }
            if (audioElements.current[remoteUser.id]) {
              audioElements.current[remoteUser.id].srcObject = remoteStream;
            } else {
              let settled = false;

              const interval = setInterval(() => {
                if (audioElements.current[remoteUser.id]) {
                  audioElements.current[remoteUser.id].srcObject = remoteStream;

                  settled = true;

                  if (settled) {
                    clearInterval(interval);
                  }
                }
              }, 1000);
            }
          });
        };
        localMediaStream.current.getTracks().forEach((track) => {
          connections.current[peerId].addTrack(track, localMediaStream.current);
        });

        if (createOffer) {
          const offer = await connections.current[peerId].createOffer();

          await connections.current[peerId].setLocalDescription(offer);

          socket.current.emit(ACTIONS.RELAY_SDP, {
            peerId,
            sessionDescription: offer,
          });
        }
      };

      const handleRemovePeer = async ({ peerId, userId }) => {
        if (connections.current[peerId]) {
          connections.current[peerId].close();
        }

        // now delete the connection of object key
        delete connections.current[peerId];
        delete audioElements.current[peerId];

        // remove from the setClients also
        setClients((list) => {
          return list.filter((client) => {
            return client.id !== userId;
          });
        });
      };

      const handleIceCandidate = async ({ peerId, icecandidate }) => {
        if (icecandidate) {
          connections.current[peerId].addIceCandidate(icecandidate);
        }
      };

      const handleRemoteSdp = async ({
        peerId,
        sessionDescription: remoteSessionDescription,
      }) => {
        connections.current[peerId].setRemoteDescription(
          new RTCSessionDescription(remoteSessionDescription)
        );

        if (remoteSessionDescription.type === "offer") {
          const connection = connections.current[peerId];
          const answer = await connection.createAnswer();
          connection.setLocalDescription(answer);

          socket.current.emit(ACTIONS.RELAY_SDP, {
            peerId,
            sessionDescription: answer,
          });
        }
      };

      const setMute = (mute, userId) => {
        const clientIndex = clientsRef.current
          .map((client) => client.id)
          .indexOf(userId);

        const connectedClients = JSON.parse(JSON.stringify(clientsRef.current));

        if (clientIndex > -1) {
          connectedClients[clientIndex].muted = mute;
          setClients(connectedClients);
        }
      };

      // Creating Sockets
      socket.current = socketInit();

      // Start Capturing the Audio
      await startCapture();

      // After capturing audio now add the client in the browser and join the socket room or send request for connection of add_peer in the backend. here muted true because we want that for first time our every user must be muted
      addNewClient({ ...user, muted: true }, () => {
        const localElement = audioElements.current[user.id];

        if (localElement) {
          localElement.volume = 0;
          localElement.srcObject = localMediaStream.current;
        }
      });

      // Listeners
      // socket.current.on(ACTIONS.MUTE_INFO, ({ userId, isMute }) => {
      //   handleMute(isMute, userId);
      // });
      socket.current.on(ACTIONS.ADD_PEER, handleNewPeer);
      socket.current.on(ACTIONS.REMOVE_PEER, handleRemovePeer);
      socket.current.on(ACTIONS.ICE_CANDIDATE, handleIceCandidate);
      socket.current.on(ACTIONS.SESSION_DESCRIPTION, handleRemoteSdp);
      socket.current.on(ACTIONS.MUTE, ({ peerId, userId }) => {
        setMute(true, userId);
      });
      socket.current.on(ACTIONS.UNMUTE, ({ peerId, userId }) => {
        setMute(false, userId);
      });

      // emitting of event
      socket.current.emit(ACTIONS.JOIN, { roomId, user });

      // end
    };

    allConnections();
    // Cleaner Function
    return () => {
      // Saving ourself from the memory leak
      localMediaStream.current.getTracks().forEach((track) => {
        track.stop();
      });
      socket.current.emit(ACTIONS.LEAVE, { roomId });

      // This cleaner is also neccessary
      // for (let peerId in connections.current) {
      //   connections.current[peerId].close();
      //   delete connections.current[peerId];
      //   delete audioElements.current[peerId];
      // }

      // unsubscribing the events
      socket.current.off(ACTIONS.ADD_PEER);
      socket.current.off(ACTIONS.ICE_CANDIDATE);
      socket.current.off(ACTIONS.SESSION_DESCRIPTION);
      socket.current.off(ACTIONS.REMOVE_PEER);
      socket.current.off(ACTIONS.MUTE);
      socket.current.off(ACTIONS.UNMUTE);
    };
  }, []);

  const provideRef = (instance, userId) => {
    audioElements.current[userId] = instance;
  };

  const handleMute = (isMute, userId) => {
    let settled = false;
    let interval = setInterval(() => {
      if (localMediaStream.current) {
        localMediaStream.current.getTracks()[0].enabled = !isMute;

        if (isMute) {
          socket.current.emit(ACTIONS.MUTE, { roomId, userId });
        } else {
          socket.current.emit(ACTIONS.UNMUTE, { roomId, userId });
        }

        settled = true;
      }

      if (settled) {
        clearInterval(interval);
      }
    }, 200);
  };

  const addNewClient = useCallback(
    (newClient, cb) => {
      const lookingFor = clients.find((client) => {
        return client.id === newClient.id;
      });
      if (lookingFor === undefined) {
        setClients((existingClients) => {
          return [...existingClients, newClient];
        }, cb);
      }
    },
    // Adding both of the dependencies is necessary
    [clients, setClients]
  );

  return { clients, provideRef, handleMute };
};
