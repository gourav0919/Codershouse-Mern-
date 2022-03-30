import React, { useState } from "react";
import styles from "./AddRoomModal.module.css";
import TextInput from "../shared/TextInput/TextInput";
import { createRoom as createNewRoom } from "../../http";
import { useNavigate } from 'react-router-dom'

const AddRoomModal = ({ closeAddRoomModal }) => {
    const navigate = useNavigate();


    // using useState to reflect which one type of room state is active
    // By default we set it to open or public room
    // we use state because we know that when a state update it automaticlly update the all DOM which use this state
    const [roomTypeClick, setRoomTypeClick] = useState("open");

    // function for setting the room type on clicking on the roomtype
    const setRoomTypePublic = () => {
        setRoomTypeClick("open");
    };
    const setRoomTypeSocial = () => {
        setRoomTypeClick("social");
    };
    const setRoomTypePrivate = () => {
        setRoomTypeClick("private");
    };

    // now making the state for storing the new room name text when the user enter it
    const [newRoomName, setNewRoomName] = useState("");

    // Function to create a room in the backend and show in the frontend as well for the user if it is public
    const createRoom = async () => {
        try {
            if (!newRoomName) return;
            // server call on /api/rooms url 
            const { data } = await createNewRoom({ roomName: newRoomName, roomType: roomTypeClick });

            const { success, room } = data;

            // If API request of new room creation done successfully then we have to show the Room.jsx where the details of joined user is shown and to remove the create new room model 
            // it means we got the positive response
            if (success) {
                // removing the newRoomModel first 
                closeAddRoomModal();

                // now we have to call the new Component Room.jsx for showing the details 
                // now our url look like this :- /room/62356be8e9324152adfd96ba
                navigate(`/room/${room.roomId}`);
            }

        } catch (error) {
            console.log(error);
        }

    }

    return (
        <div className={styles.modalMask}>
            <div className={styles.modalBody}>
                <button className={styles.closeAddRoomBtn} onClick={closeAddRoomModal}>
                    <img src="/images/cross-icon.png" alt="cross" />
                </button>
                <div className={styles.modalHeader}>
                    <h3 className={styles.roomTopicHeading}>
                        Enter the topic to be disscussed
                    </h3>
                    {/* In this way we can store the onchange value in the newRoomName state */}
                    <TextInput
                        fullwidth="true"
                        value={newRoomName}
                        onChange={(event) => {
                            setNewRoomName(event.target.value);
                        }}
                    />
                    <div className={styles.roomTypeInformation}>
                        <h3>Room Type</h3>
                        <div className={styles.roomTypes}>
                            <div
                                onClick={setRoomTypePublic}
                                className={`${styles.roomType} ${roomTypeClick === "open" ? styles.active : ""
                                    }`}
                            >
                                <img src="/images/public-room-icon.png" alt="globe" />
                                <span>Open</span>
                            </div>
                            <div
                                onClick={setRoomTypeSocial}
                                className={`${styles.roomType} ${roomTypeClick === "social" ? styles.active : ""
                                    }`}
                            >
                                <img src="/images/social-room-icon.png" alt="social" />
                                <span>Social</span>
                            </div>
                            <div
                                onClick={setRoomTypePrivate}
                                className={`${styles.roomType} ${roomTypeClick === "private" ? styles.active : ""
                                    }`}
                            >
                                <img src="/images/private-room.png" alt="lock" />
                                <span>Private</span>
                            </div>
                        </div>
                    </div>
                </div>
                {/* This is necessary to see the difference between the header and footer of addRoom modal */}
                <div className={styles.modalFooter}>
                    <h3>Text for different types of room</h3>
                    <button onClick={createRoom} className={styles.addRoomBtn}>
                        <img
                            src="/images/add-room-button-emoji.png"
                            alt="add room hurrah emoji"
                        />
                        <span className={styles.addRoomBtnText}>Let's Go</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddRoomModal;
