import React, { useState, useEffect } from 'react';
import styles from './SingleRoom.module.css'
import { useWebRTC } from "../../hooks/useWebRTC"
import {useParams, useHistory} from "react-router-dom"
import { useSelector } from 'react-redux';
import { getRoom } from "../../http/index"

function SingleRoom(props) {
    const {id: roomId} = useParams();
    const user = useSelector(state => state.auth.user)
    const {clients, provideRef, handleMute} = useWebRTC(roomId, user);
    const history = useHistory()
    const [room, setRoom] = useState(null);
    const [isMute, setMute] = useState(true);
    const handleManualLeave = () => {
        history.push('/rooms')
    }

    const handleMuteClick = (clientId) => {
        
        if(clientId === user._id){
            setMute((prev)=> !prev)
            console.log(isMute)
        }
       
    }

    

    useEffect(()=>{
        handleMute(isMute, user._id);
    },[isMute, handleMute, user._id])


    useEffect(()=>{
        const fetchRoom = async()=>{
            const {data} = await getRoom(roomId);
            console.log(data)
            setRoom(data);
        }
        fetchRoom()
    },[roomId])

    return (
        <div>
            <div className="container">
                <button onClick={handleManualLeave} className={styles.goback} >
                    <img alt="arrow-left" src="/images/arrow-left.png"/>
                    <span>All voice rooms</span>
                </button>
            </div>
            <div className={styles.clientsWrap}>
                <div className={styles.header}>
                    <h2 className={styles.topic}>{room?.topic}</h2>
                    <div className={styles.actions}>
                        <button className={styles.actionBtn}>
                            <img alt="palm" src="/images/palm.png" />
                        </button>
                        <button onClick={handleManualLeave} className={styles.actionBtn}>
                            <img alt="win" src="/images/win.png" /> 
                            <span>Leave Quickly</span>
                        </button>
                    </div>
                </div>
                <div className={styles.clientsList}>
                        {
                            clients.map((client)=>{
                                return <div key={client._id} className={styles.client}>
                                            <div className={styles.userHead} >
                                                <audio autoPlay playsInline ref={(instance)=> provideRef(instance,client._id)} ></audio>
                                                <img alt="avatar" className={styles.userAvatar} src={client.avatar} /> 
                                                <button onClick={()=> handleMuteClick(client._id)} className={styles.micBtn}>
                                                    {
                                                        client.muted 
                                                        ?  <img alt="mic-mute" src="/images/mic-mute.png" />
                                                        :  <img alt="mic" src="/images/mic.png" />
                                                    }
                                                     {/* <img src="/images/mic.png" />
                                                    <img src="/images/mic-mute.png" /> */}
                                                </button>                                  
                                            </div>
                                            <h4>{client.name}</h4>
                                        </div>
                            })
                        }
                </div>
            </div>
        </div>
    );
}

export default SingleRoom;