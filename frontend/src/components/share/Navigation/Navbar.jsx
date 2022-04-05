import React from 'react';
import {Link} from 'react-router-dom'
import { logout } from '../../../http';
import styles from './Navbar.module.css'
import { useDispatch, useSelector } from 'react-redux';
import { setAuth } from '../../../store/authSlice';


function Navbar(props) {

    const dispatch = useDispatch()

    const { isAuth, user } = useSelector((state)=>state.auth)

    
    const brandStyle = {
        color:'#fff',
        textDecoration:'none',
        fontWeight:'bold',
        fontSize:'22px',
        display:'flex',
        alignItems:'center'
    };

    const logoText = {
        marginLeft:'10px'
    }

    async function LogoutUser(){
        try{
            const {data} = await logout();
            dispatch(setAuth(data))
        }catch(err){
            console.log(err)
        }
    }


    return (
        <nav className={`${styles.navbar} container`}>
            <Link style={brandStyle} to='/' > 
                <img src="/images/logo.png" alt="logo" />
                <span style={logoText}>Pitch Your Voice</span>
            </Link>
            <div className={styles.rightSide}>
              { user && <h3 >{user.name}</h3>}  
            { isAuth && <img className={styles.avatarImg} src={user.avatar} alt="" />}
            { user && isAuth &&  <img  onClick={LogoutUser} src="/images/logout.png" alt="logo" />} 
            {/* { isAuth && <button className={styles.logoutButton} onClick={LogoutUser}>Logout</button> } */}
            </div>
            
        </nav>
    );
}

export default Navbar;