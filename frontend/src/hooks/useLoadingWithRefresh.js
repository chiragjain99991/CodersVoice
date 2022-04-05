import { useEffect, useState } from 'react';
import axios from 'axios'
import { useDispatch } from 'react-redux';
import { setAuth } from '../store/authSlice';
export function useLoadingWithRefresh(){
    const [loading,setLoding] = useState(true);
    const dispatch = useDispatch()
    useEffect(()=>{
        (async()=>{
            try{
                const {data} = await axios.get(`${process.env.REACT_APP_BASE_URL}api/refresh`,
                {
                    withCredentials: true
                }
            )
            dispatch(setAuth(data))
            setLoding(false)
            } catch(err){
                console.log(err)
                setLoding(false)
            }
        })();
    },[dispatch])

    return { loading };
}