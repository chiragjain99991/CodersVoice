import React, { useState } from 'react';
import styles from "./AddRoomModal.module.css"
import TextInput from "../share/TextInput/TextInput"
import { createRoom } from "../../http"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useHistory } from "react-router-dom"

function AddRoomModal({closeModal}) {
    const [roomType, setRoomType] = useState('open');
    const [topic, setTopic] = useState("")
    const history  = useHistory()
    async function createroom(){
        const sendData = {
            roomType,
            topic
        }
        try{

            if(!topic){
                toast.error("Please Enter Topic")
                return;
            }
            console.log(sendData)
            const { data } = await createRoom(sendData);
            console.log(data)
            if(data){
                history.push(`/room/${data.id}`)
            }
        }catch(err){
            console.log(err.message)
        }

    }
    return (
        <div className={styles.modalMask} >
             <ToastContainer 
            position="bottom-right"
            autoClose={3000}
            />
            <div className={styles.modalBody}>
                <button onClick={()=>closeModal()} className={styles.modalClose}>
                    <img src="/images/close.png" alt="" />
                </button>
                <div className={styles.modalHeader}>
                    <h3 className={styles.modalHeaderTilte}>Enter the topic to be discussed</h3>
                    <TextInput value={topic} onChange={(e)=>setTopic(e.target.value)} fullwidth="true" />
                    <h2 className={styles.roomTypesHeading} >Room Types</h2>
                    <div className={styles.roomTypes} >
                        <div  onClick={()=>setRoomType('open')} className={`${styles.typeBox} ${roomType === 'open' ? styles.active : ""}`} >
                            <img src="/images/globe.png" alt="globe" />
                            <span>Open</span>
                        </div>
                        <div onClick={()=>setRoomType('social')} className={`${styles.typeBox} ${roomType === 'social' ? styles.active : ""}`} >
                            <img src="/images/social.png" alt="social" />
                            <span>Social</span>
                        </div>
                        <div onClick={()=>setRoomType('private')} className={`${styles.typeBox} ${roomType === 'private' ? styles.active : ""}`}>
                            <img src="/images/lock.png" alt="lock" />
                            <span>Private</span>
                        </div>
                    </div>
                </div>
                <div className={styles.modalFooter}>
                    <h2>Start a room, open to everyone</h2>
                    <button onClick={createroom} className={styles.modalFooterButton}>
                        <img src="/images/celebration.png" alt="celebration" /><span className={styles.modalFooterButtonSpan} >Let's go</span>
                    </button>

                </div>
            </div>
        </div>
    );
}

export default AddRoomModal;