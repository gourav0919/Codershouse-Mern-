import React, { useEffect, useState } from 'react'
import styles from './Rooms.module.css'
import RoomCard from '../../components/RoomCard/RoomCard'
import AddRoomModal from '../../components/AddRoomModal/AddRoomModal'
import { getAllPublicRooms } from '../../http'

// Dummy data for rooms list 
// const rooms = [
//     {
//         id: 1,
//         topic: "Which framework is best for frontend?",
//         speakers: [
//             {
//                 id: 1,
//                 name: 'Gourav Khurana',
//                 avatar: '/images/room-demo1.png',
//             },
//             {
//                 id: 2,
//                 name: 'Sahil Bansal',
//                 avatar: '/images/room-demo2.png',
//             },
//         ],
//         totalPeople: 40,
//     },
//     {
//         id: 2,
//         topic: "How to get a Job in FAANG?",
//         speakers: [
//             {
//                 id: 1,
//                 name: 'Gourav Khurana',
//                 avatar: '/images/room-demo1.png',
//             },
//             {
//                 id: 2,
//                 name: 'Sahil Bansal',
//                 avatar: '/images/room-demo2.png',
//             },
//         ],
//         totalPeople: 72,
//     },
//     {
//         id: 3,
//         topic: "How you define Machine Learning?",
//         speakers: [
//             {
//                 id: 1,
//                 name: 'Gourav Khurana',
//                 avatar: '/images/room-demo1.png',
//             },
//             {
//                 id: 2,
//                 name: 'Sahil Bansal',
//                 avatar: '/images/room-demo2.png',
//             },
//         ],
//         totalPeople: 6,
//     },
//     {
//         id: 4,
//         topic: "Why you did not like DSA?",
//         speakers: [
//             {
//                 id: 1,
//                 name: 'Gourav Khurana',
//                 avatar: '/images/room-demo1.png',
//             },
//             {
//                 id: 2,
//                 name: 'Sahil Bansal',
//                 avatar: '/images/room-demo2.png',
//             },
//         ],
//         totalPeople: 15,
//     },
// ]


const Rooms = () => {
    const [showModal, setShowModal] = useState(false);
    const [rooms, setRooms] = useState([]);

    // now we want to call this function only once just after our component renders only for the first time not for the every time
    // My plan was to make a function and then call it this plan is good but if we add useEffect then this plan is pure gold it automaticlly now adds the responsibility to the hooks to do this work
    useEffect(() => {
        // fetch all of the rooms list and update it to the local state of rooms
        const fetchRooms = async () => {
            try {
                // now this request is going to be called in the every refresh or new login or signup
                const { data } = await getAllPublicRooms();
                // We know that if there is any error then it directly go to the catch block after wards the above line and did not come down for executing the code
                const { success, rooms: roomsList } = data;

                if (success) {
                    setRooms(roomsList);
                }
            } catch (error) {
                console.log(error);
            }
        }

        // now calling the fetchRooms function 
        fetchRooms();
    }, [])


    const openModal = () => {
        setShowModal(true);
    }
    const closeModal = () => {
        setShowModal(false);
    }

    return <>
        {/* Making an hr component so that it can be reusable in multiple pages  */}
        <hr />
        <div className='container'>
            <div className={styles.roomHeader}>
                <div className={styles.left}>
                    <span className={styles.roomHeadingText}>All voice rooms</span>
                    <div className={styles.searchBoxWrapper}>
                        <label htmlFor="search"><img src="/images/search.png" alt="search" className={styles.searchImage} /></label>
                        {/* <img src="/images/search.png" alt="search" className={styles.searchImage} /> */}
                        <input type="text" name="search" id='search' className={styles.searchBox} />
                    </div>
                </div>
                <div className={styles.right}>
                    <button className={styles.startRoomBtn} onClick={openModal}>
                        <img src="/images/start-room.png" alt="Start Room Emoji" />
                        <span className={styles.startRoomBtnText}>Start a room</span>
                    </button>
                </div>
            </div>
            {/* This list of rooms is coming from the backend currently we are using dummy data for creating the frontend and when our backend gets ready we replace it with real data */}
            {/* Now from here making the list of all of the available rooms */}
            <div className={styles.roomList}>
                {/* now here i add all of the fields of room object as the props so we save from writing it again and again */}
                {/* {rooms.map((room) => { return <RoomCard key={room.id} id={room.id} topic={room.topic} speakers={room.speakers} totalPeople={room.totalPeople} /> })} */}
                {/* This return an array remeber it */}
                {rooms.map((room) => { return <RoomCard key={room.roomId} {...room} /> })}

                {/* This can not run but if we add array braces then it can run */}
                {/* {<div>I am javascript</div>, <div>I am javascript2</div>, <div>I am javascript3</div>, <div>I am javascript4</div>} */}
                {/* This is running but not as we wanted or expected*/}
                {/* [<div>I am javascript4</div>, <div>I am javascript4</div>] */}
            </div>
        </div>

        {/* Adding the AddRoomModal in this */}
        {showModal && <AddRoomModal closeAddRoomModal={closeModal} />}
    </>
}

export default Rooms