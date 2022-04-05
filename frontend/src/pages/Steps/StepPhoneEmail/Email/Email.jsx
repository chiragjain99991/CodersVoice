import React ,{ useState } from 'react';
import Card from '../../../../components/share/Card/Card';
import Button from '../../../../components/share/Button/Button';
import TextInput from '../../../../components/share/TextInput/TextInput';
import styles from '../StepPhoneEmail.module.css'

function Email({onNext}) {
    const[email,setEmail] = useState('');
    return (
        <Card title="Enter your Email" icon="email-emoji.png">
            <TextInput value={email} onChange={(e)=> {setEmail(e.target.value)} }/>
            <div>
                <div className={styles.actionButton}>
                    <Button heading="Next" nextFunc={onNext}></Button>
                </div>
                <p className={styles.bottomPara}>By entering your number. you're agreeing to our terms of Service and Privacy Policy. Thanks!</p>
            </div>
       
        </Card>
    );
}

export default Email;