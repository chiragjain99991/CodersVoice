import React, { useState, useEffect } from 'react';
import styles from './Room.module.css'
import RoomCard from '../../components/share/RoomCard/RoomCard';
import AddRoomModal from '../../components/AddRoomModal/AddRoomModal';
import { getRooms } from "../../http"



function Room(props) {
    const [show,setShow] = useState(false);
    const [rooms, setRooms] = useState([])
    function closeModal(){
        setShow(false);
    }
    useEffect(()=>{
        const fetchRooms = async()=>{
            const { data } = await getRooms();
            setRooms(data);
        }
        fetchRooms();
    },[])
    // const rooms = [
    //     {
    //         id: 1,
    //         topic: 'Which framework best for frontend ?',
    //         speakers: [
    //             {
    //                 id: 1,
    //                 name: 'John Doe',
    //                 avatar: '/images/monkey-avatar.png',
    //             },
    //             {
    //                 id: 2,
    //                 name: 'Jane Doe',
    //                 avatar: '/images/monkey-avatar.png',
    //             },
    //         ],
    //         totalPeople: 40,
    //     },
    //     {
    //         id: 3,
    //         topic: 'What’s new in machine learning?',
    //         speakers: [
    //             {
    //                 id: 1,
    //                 name: 'John Doe',
    //                 avatar: '/images/monkey-avatar.png',
    //             },
    //             {
    //                 id: 2,
    //                 name: 'Jane Doe',
    //                 avatar: '/images/monkey-avatar.png',
    //             },
    //         ],
    //         totalPeople: 40,
    //     },
    //     {
    //         id: 4,
    //         topic: 'Why people use stack overflow?',
    //         speakers: [
    //             {
    //                 id: 1,
    //                 name: 'John Doe',
    //                 avatar: '/images/monkey-avatar.png',
    //             },
    //             {
    //                 id: 2,
    //                 name: 'Jane Doe',
    //                 avatar: '/images/monkey-avatar.png',
    //             },
    //         ],
    //         totalPeople: 40,
    //     },
    //     {
    //         id: 5,
    //         topic: 'Artificial inteligence is the future?',
    //         speakers: [
    //             {
    //                 id: 1,
    //                 name: 'John Doe',
    //                 avatar: '/images/monkey-avatar.png',
    //             },
    //             {
    //                 id: 2,
    //                 name: 'Jane Doe',
    //                 avatar: '/images/monkey-avatar.png',
    //             },
    //         ],
    //         totalPeople: 40,
    //     },
    // ];
    return (
       <>
       <div className="container">
            <div className={styles.roomsHeader} >
                <div className={styles.roomsHeaderLeft}>
                    <span className={styles.heading} >All voice rooms</span>
                    <div className={styles.searchBox} >
                        <img src="/images/search-icon.png" alt="logo" />
                        <input className={styles.searchBoxInput} type="text"/>
                    </div>
                </div>
                <div className={styles.roomsHeaderRight}> 
                    <button onClick={()=>setShow(true)} className={styles.startRoomButton} >
                        <img src="/images/add-room-icon.png" alt="logo" />
                        <span>Start a room</span>
                    </button>
                </div>
            </div>
            <div className={styles.roomList}>
                {
                    rooms.map((room, index)=>{
                        return <RoomCard key={index} room={room} />
                       
                    })
                }
            </div>
       </div>
       { show && <AddRoomModal closeModal={closeModal}/>}
       </>
    );
}

export default Room;