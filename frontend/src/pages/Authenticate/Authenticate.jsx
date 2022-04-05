import React,{useState} from 'react';
import StepPhoneEmail from '../Steps/StepPhoneEmail/StepPhoneEmail'
import StepOTP from '../Steps/StepOTP/StepOTP'

const steps = {
    1:StepPhoneEmail,
    2:StepOTP
}


function Authenticate(props) {
    const [step,setStep] =useState(1);
    function nextPageFunc(){
        setStep(step+1);
        
    }
    const Step = steps[step]
    return (
        <div>
            <Step nextPage={nextPageFunc} />
        </div>
    );
}

export default Authenticate;