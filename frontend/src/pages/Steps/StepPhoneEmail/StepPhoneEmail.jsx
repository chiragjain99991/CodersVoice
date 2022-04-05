import React ,{useState} from 'react';
import Phone from './Phone/Phone';
import Email from './Email/Email';
import styles from './StepPhoneEmail.module.css'

const phoneEmail = {
    phone:Phone,
    email:Email
}

function StepPhoneEmail({nextPage}) {
    const [type,setType] =useState('email');
    
    const Component = phoneEmail[type]
    return (
        <>
            <div className={styles.cardWrapper}>
               <div>
               <div className={styles.buttonWrap} >
                    <button className={`${styles.tabbutton} ${
                        type==='phone' ? styles.active : ''}`} onClick={()=>setType('phone')}> <img src="/images/phone-white.png" alt="phone-white" /> </button>
                    <button className={`${styles.tabbutton} ${
                        type==='email' ? styles.active : ''}`}  onClick={()=>setType('email')}> <img src="/images/mail-white.png" alt="mail-white" /> </button>
                </div>
                
                <Component onNext={nextPage} />
               </div>
            </div>
            
          
        </>
    );
}

export default StepPhoneEmail;