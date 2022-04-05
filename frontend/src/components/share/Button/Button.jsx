import React from 'react';
import styles from './Button.module.css'

function Button({heading,nextFunc}) {
    
    return (
        
             <button onClick={nextFunc} className={styles.button}>
                    <span>{heading}</span>
                    <img className={styles.arrow} src="/images/arrow-forward.png" alt="arrow-forward" />
            </button>
       
    );
}

export default Button;