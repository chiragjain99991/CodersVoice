import React, { useState } from 'react';
import Card from '../../../../components/share/Card/Card';
import Button from '../../../../components/share/Button/Button';
import TextInput from '../../../../components/share/TextInput/TextInput';
import styles from '../StepPhoneEmail.module.css'
import { sendOtp } from '../../../../http/index'
import { useDispatch } from 'react-redux'
import { setOtp } from '../../../../store/authSlice'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Phone({onNext}) {
    const[phone,setPhone] = useState('');
    const dispatch = useDispatch();
    const notify = () => toast.error("Please Enter Phone Number");

    async function submit(){
      if(phone){
        try{
            //server request]
        const { data } = await sendOtp({phone})
        console.log(data)
        dispatch(setOtp({ phone:data.phone, hash:data.hash}))
        onNext();

        } catch ( err ){
            console.log(err)
        }
      }else{
        notify()
      }
    }
   
    return (
       <>
        <ToastContainer 
        position="bottom-right"
        autoClose={3000}
        />
        <Card title="Enter your phone number" icon="phone.png">
            <TextInput value={phone} onChange={(e)=> {setPhone(e.target.value)} }/>
            <div>
            <div className={styles.actionButton}>
            <Button heading="Next" nextFunc={submit}></Button>
            </div>
            <p className={styles.bottomPara}>By entering your number. you're agreeing to our terms of Service and Privacy Policy. Thanks!</p>
            </div>
           
        </Card>
       </>
    );
}

export default Phone;