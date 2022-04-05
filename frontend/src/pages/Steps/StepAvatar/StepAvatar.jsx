import React, { useEffect, useState } from 'react';
import Card from '../../../components/share/Card/Card';
import Button from '../../../components/share/Button/Button';

import styles from './StepAvatar.module.css'
import { useDispatch } from 'react-redux'
import { setAvatar } from '../../../store/activateSlice'
import { useSelector } from "react-redux"
import { activate } from "../../../http/index"
import { setAuth } from '../../../store/authSlice'
import Loader from '../../../components/share/Loader/Loader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function StepAvatar() {
    const { name } = useSelector((state) => state.activate)
    let { avatar } = useSelector((state) => state.activate)
    const [mainAvatar,setMainAvatar] = useState('/images/monkey-avatar.png')
    const [loading,setLoading] = useState(false)
    const [unmounted, setUnmounted] = useState(false);
    const dispatch = useDispatch();
    const notify = () => toast.error("Please Select Image");

    function captureImage(event){
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = function(){
            setMainAvatar(reader.result);
            dispatch(setAvatar(reader.result))
        }
        console.log(event)
    }


    async function submit(){
        
        if(!name || !avatar) {     
            notify()
            return;
        }
        setLoading(true)
        try{
            const { data } = await activate({name, avatar });
            console.log(data)
            if(data.auth){
                // check 
                if(!unmounted){
                    dispatch(setAuth( data ))
                }
                
            }
            
        }catch(err){
            console.log(err)
            
        } finally{
            setLoading(false)
        }
    

    }
    useEffect(()=>{
        return ()=>{
            setUnmounted(true);
        }
    },[]);
    if(loading) return <Loader message="Activation In Progress"/>
   
    return ( 
        <div className={styles.cardWrapper}>
            <ToastContainer 
            position="bottom-right"
            autoClose={3000}
            />
           <Card title={`Okay, ${name}`} icon="monkey-emoji.png">
           <p className={styles.bottomPara}>How's this photo.?</p>
            <div className={styles.avatarWrapper}>
                <img className={styles.avatarImg} src={mainAvatar} alt="avatar" />
            </div>
            <div className={styles}>
                <label className={styles.avatarLabel} htmlFor="avatarImg">Choose a different photo</label>
                <input onChange={(e) => {captureImage(e)}} id="avatarImg" type="file" className={styles.avatarInput}/>
            </div>
            <div>
                <div className={styles.actionButton}>
                    <Button heading="Next" nextFunc={submit}></Button>
                </div>  
            </div>
           
        </Card>
    </div>
    );

}

export default StepAvatar;