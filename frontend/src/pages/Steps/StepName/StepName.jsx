import React, { useState } from 'react';
import Card from '../../../components/share/Card/Card';
import Button from '../../../components/share/Button/Button';
import TextInput from '../../../components/share/TextInput/TextInput';
import styles from './StepName.module.css'
import { useDispatch } from 'react-redux'
import { setName } from '../../../store/activateSlice'
import { useSelector } from "react-redux"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function StepName({nextPage}) {
    const { name } = useSelector((state) => state.activate)
    const [fullName,setFullName] = useState(name)
    const dispatch = useDispatch();
    const notify = () => toast.error("Please Enter Name");
    function nexStep(){
        if(!fullName){          
            notify()
            return;
        }
        dispatch(setName(fullName))
        nextPage()
    }
    return (
        <div className={styles.cardWrapper}>
            <ToastContainer 
            position="bottom-right"
            autoClose={3000}
            />
           <Card title="What's your full name?" icon="goggle-emoji.png">
            <TextInput value={fullName} onChange={(e)=> {setFullName(e.target.value)} }/>
            <div>
            <p className={styles.bottomPara}>People use real names at codershouse :)</p>
            <div className={styles.actionButton}>
            <Button heading="Next" nextFunc={nexStep}></Button>
            </div>
           
            </div>
           
        </Card>
    </div>
    );
}

export default StepName;