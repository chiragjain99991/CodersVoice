import React,{useState} from 'react';

import StepAvatar from '../Steps/StepAvatar/StepAvatar';
import StepName from '../Steps/StepName/StepName';

const steps = {
    1:StepName,
    2:StepAvatar
}


function Activate(props) {
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

export default Activate;



// import React from 'react';

// function Activate(props) {
//     return (
//         <div>
//             Activation
//         </div>
//     );
// }

// export default Activate;