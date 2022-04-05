import React, { useState } from 'react';
import Card from '../../../components/share/Card/Card';
import Button from '../../../components/share/Button/Button';
import TextInput from '../../../components/share/TextInput/TextInput';
import styles from './StepOTP.module.css'
import { verifyOtp } from '../../../http/index'
import { useSelector } from 'react-redux'
import { setAuth } from '../../../store/authSlice'
import { useDispatch } from 'react-redux'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function StepOTP({nextPage}) {
    const [otp,setOtp] = useState('');
    const { phone, hash } = useSelector((state)=>state.auth.otp)
    const dispatch = useDispatch()
    const notify = () => toast.error("Please Enter Otp");

    async function submit(){
       if(otp && phone && hash){
        try{
            
            // server request
            const {data}  = await verifyOtp({ otp, phone, hash })
            console.log(data)
            dispatch(setAuth( data ))

       } catch ( err ){
           console.log(err)
       }
       }else{
        notify()
      }
    }


    return (
        <div className={styles.cardWrapper}>
            <ToastContainer 
            position="bottom-right"
            autoClose={3000}
            />
             <Card title="Enter the code we just texted you" icon="lock-emoji.png">
            <TextInput value={otp} onChange={(e)=> {setOtp(e.target.value)} }/>
            <div>
            <div className={styles.actionButton}>
            <Button heading="Next" nextFunc={submit}></Button>
            </div>
            <p className={styles.bottomPara}>By entering your number. you're agreeing to our terms of Service and Privacy Policy. Thanks!</p>
            </div>
           
        </Card>
        </div>
    );
}

export default StepOTP;