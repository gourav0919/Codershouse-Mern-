import React from 'react';
import styles from './RoomCard.module.css';
import { useNavigate } from 'react-router-dom';

// we pass props to the roomCard component and now here we simply destructured props which we need to work with in the speakers we receive the array so we have to use indexes to access it
const RoomCard = ({ roomId, topic, totalPeople, speakers }) => {
    const navigate = useNavigate();

    return (
        <div onClick={() => navigate(`/room/${roomId}`)} className={styles.roomCardWrapper}>
            <h3 className={styles.roomCardHeading}>{topic}</h3>
            <div className={`${styles.speakersInformation} ${speakers.length === 1 ? styles.singleSpeaker : ''}`}>
                <div className={styles.avatars}>
                    {speakers.map((speaker) => {
                        return <img key={speaker.id} src={speaker.avatar} alt='speaker-avatar' />
                    })}
                </div>
                <div className={styles.speakersNames}>
                    {speakers.map((speaker) => {
                        return <div key={speaker.id} className={styles.nameWrapper}>
                            <span>{speaker.name}</span>
                            <img src="/images/chat-bubble.png" alt="chat-bubble" />
                        </div>
                    })}
                </div>
            </div>
            <div className={styles.totalPeoplesWrapper}>
                <span>{totalPeople}</span>
                <img src="/images/peoples-icon.png" alt="total-peoples-icon" />
            </div>
        </div>

        // <div>{`${id}, ${topic}, ${speakers[0].name}, ${totalPeople}`}</div>
    )
}

export default RoomCard