import React from 'react';
import styles from './Home.module.css'
import { useHistory} from 'react-router-dom'
import Card from '../../components/share/Card/Card';
import Button from '../../components/share/Button/Button';

function Home(props) {

    const history = useHistory()
    function startRegister(){
        history.push('/authenticate')
    }
    return (
      <div className={styles.mainDiv}>
            <Card title="Welcome to House!!" icon="logo.png">
                    <p className={styles.para}>
                        The project aims at sharing of ideas among people 
                        of similar domains so as to increase knowledge of community 
                        and at the same time learn new things from community as well.!!
                    </p>
                    <div>
                       <Button nextFunc={startRegister} heading="Let's Go"></Button>
                    </div>
                    <div className={styles.signInWrapper}>
                        <span className={styles.invite}>Have an invite text?</span>
                        
                    </div>
            </Card>
      </div>
    );
}

export default Home;