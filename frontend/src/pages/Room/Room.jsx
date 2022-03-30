import React, { useEffect, useState } from 'react'
import styles from './Room.module.css'
import { useParams } from 'react-router-dom'
import { useWebRTC } from '../../hooks/useWebRTC'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getSingleRoom } from '../../http'

const Room = () => {
    const { roomId } = useParams();
    const { user } = useSelector((state) => state.auth);
    const { clients, provideRef, handleMute } = useWebRTC(roomId, user);

    const navigate = useNavigate();
    const handleManualLeave = () => {
        navigate('/rooms');
    }

    const [room, setRoom] = useState(null);
    useEffect(() => {
        const fetchRoom = async () => {
            const { data } = await getSingleRoom(roomId);
            const { room } = data;
            setRoom((prev) => room);
        };

        fetchRoom();
    }, [roomId]);

    const [isMute, setIsMute] = useState(true);
    useEffect(() => {
        handleMute(isMute, user.id);
    }, [isMute]);

    const setMuteOrUnmute = (clientId) => {
        if (user.id === clientId) {
            setIsMute((mute) => !mute);
        }
    }

    return (
        <div>
            <div className="container">
                <button className={styles.goBackBtn} onClick={handleManualLeave}>
                    <img src="/images/arrow-back.png" alt="Back Arrow" />
                    <span className={styles.backBtnText}>All voice rooms</span>
                </button>
            </div>
            <div className={styles.clientsWrapper}>
                <div className={styles.roomHeader}>
                    <h2 className={styles.roomTopic}>{room?.topic}</h2>
                    <div className={styles.actionButtons}>
                        <button className={styles.actionBtn}>
                            <img src="/images/palm.png" alt="palm" />
                        </button>
                        <button className={styles.actionBtn} onClick={handleManualLeave}>
                            <img src="/images/win.png" alt="win-icons" />
                            <span>Leave quietly</span>
                        </button>
                    </div>

                </div>
                <div className={styles.clientsList}>
                    {
                        clients.map((client) => {
                            return (
                                <div className={styles.client} key={client.id}>
                                    <div className={styles.userHead}>
                                        <audio ref={(instance) => provideRef(instance, client.id)}
                                            autoPlay
                                        ></audio>
                                        <img className={styles.userAvatar} src={client.avatar} alt="user avatar" />
                                        <button className={styles.micBtn} onClick={() => setMuteOrUnmute(client.id)}>
                                            {/* This is for showing the mic on icon */}
                                            {client.muted ? <img src="/images/mic_off.png" alt="mic off icon" /> : <img src="/images/mic.png" alt="mic icon" />}
                                        </button>
                                    </div>
                                    <h4>{client.name}</h4>
                                </div>
                            );
                        })
                    }
                </div>

            </div>
        </div>
    )
}

// Remember this firstly jsx will render and then the useEffect hook of useWebRTC will run

export default Room;


// one error discovered when you close the browser and it is last tab and you close that tab then remove peer event is not triggered
// Some functionality are left like making of speakers in the backend so only speakers can speak and much more about the responsiveness of the website