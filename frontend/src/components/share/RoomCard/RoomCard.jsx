import React from 'react';
import styles from "./RoomCard.module.css"
import { useHistory } from "react-router-dom"

function RoomCard({room}) {
    const history = useHistory();
    return (
       <>
            <div onClick={()=>{history.push(`/room/${room.id}`)}} className={styles.cardWrapper}>
                <h3 className={styles.topic}>{room.topic}</h3>
                <div className={`${styles.speakers} ${room.speakers.length === 1 ? styles.singleSpeaker : ''}`}>
                    <div className={styles.speakersImages}>
                        {
                            room.speakers.map((speaker,index)=>{
                                return <img key={index} src={speaker.avatar} alt="speakerImg" />
                            })
                        }
                    </div>
                    <div className={styles.speakersNames}>
                    {
                            room.speakers.map((speaker, index)=>{
                                return (
                                    <div key={index} className={styles.nameWrapper}>
                                        <span>{speaker.name}</span>
                                        <img src="/images/chat-bubble.png" alt="" />
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
                <div className={styles.peopleCount}>
                        <span>{room.totalPeople}</span>
                        <img src="/images/user-icon.png" alt="" />
                </div>
            </div>
       </>
    );
}

export default RoomCard;