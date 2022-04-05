import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    withCredentials:true,
    headers:{
        'Content-type':'application/json',
        Accept:'application/json',
    }
})


// list of all endpoints 


export const sendOtp = (data) => api.post('/api/send-otp',data) 
export const verifyOtp = (data) => api.post('/api/verify-otp',data) 
export const activate = (data) => api.post('/api/activate',data) 
export const logout = () => api.post('/api/logout')
export const createRoom = (data) => api.post('/api/rooms',data)
export const getRooms = () => api.get('/api/rooms')
export const getRoom = (roomId) => api.get(`/api/rooms/${roomId}`)


//Interceptors
api.interceptors.response.use(

    (config)=>{ return config }, 

    async (err)=>{
        const originalRequest = err.config;
        if(err.response.status === 401 && err.config && !err.config._isRetry){

            originalRequest.isRetry = true ;
            try{
                await axios.get(`${process.env.REACT_APP_BASE_URL}api/refresh`,
                {
                    withCredentials: true
                }
                )

                return api.request(originalRequest);


            }catch(err){
                console.log(err)
            }

        }

        throw err;
    } 
)





export default api ; 