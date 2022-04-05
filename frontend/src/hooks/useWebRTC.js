import {  useEffect, useRef, useCallback } from 'react';
import { useStateWithCallBack } from './useStateWithCallBack';
import {socketInit} from "../socket"
import { ACTIONS } from '../actions';
import freeice from "freeice"
export const useWebRTC = (roomId, user) => {

        const [clients, setClients] = useStateWithCallBack([]);
        const audioElements = useRef({});
        const connections = useRef({});
        const localMediaStream = useRef(null);
        const socket = useRef(null);
        const clientsRef = useRef([]);
       

        const addNewClient = useCallback(
            (newClient, cb)=>{
                 const lookingFor = clients.find((client)=>client._id === newClient._id );
                 if(lookingFor === undefined){
                     setClients((prev)=> [...prev,newClient], cb)
                 }
            },
            [clients, setClients]
        )



       useEffect(()=>{
          clientsRef.current = clients;
       },[clients])


       useEffect(()=>{
        // let observerRefValue = null;
        // let observerRefValue2 = null;
       
     
            const initChat = async()=>{
                socket.current = socketInit();
                await captureMedia();
                addNewClient({...user, muted:true }, () => {
                    const localElement = audioElements.current[user._id];
                    if(localElement){
                        localElement.volume = 0;
                        localElement.srcObject = localMediaStream.current;
                    }
                })

                socket.current.on(ACTIONS.MUTE_INFO, ({ userId, isMute }) => {
                    setMute(isMute, userId);
                });
                socket.current.on(ACTIONS.ADD_PEER,handleNewPeer)
                socket.current.on(ACTIONS.REMOVE_PEER, handleRemovePeer);
                socket.current.on(ACTIONS.ICE_CANDIDATE,({peerId, icecandidate})=>{
                    if(icecandidate){
                        connections.current[peerId].addIceCandidate(icecandidate);
                    }
                })
                socket.current.on(ACTIONS.SESSION_DESCRIPTION,handleRemoteSDP);
                socket.current.on(ACTIONS.MUTE,({peerId, userId})=>{            
                    setMute(true, peerId, userId);
                })
                socket.current.on(ACTIONS.UNMUTE,({peerId, userId})=>{                   
                    setMute(false, peerId, userId)
                })

                socket.current.emit(ACTIONS.JOIN,{roomId, user});


                async function captureMedia() {
                    // Start capturing local audio stream.
                    localMediaStream.current = await navigator.mediaDevices.getUserMedia({
                        audio: true
                    })
                }
                async function handleNewPeer({peerId, createOffer, user: remoteUser}){
                    if(peerId in connections.current){
                        return console.warn(`you arer already connected with ${peerId}`)
                    }
            
                    connections.current[peerId] = new RTCPeerConnection({
                        iceServers: freeice()
                    });
            
                    //handle new iceCandidate
                    connections.current[peerId].onicecandidate = (e) => {
                        socket.current.emit(ACTIONS.RELAY_ICE,{
                            peerId,
                            icecandidate: e.candidate
                        })
                    }
            
                    //Handle on track on this connection
                    connections.current[peerId].ontrack = ({
                        streams: [remoteStream]
                    }) => {
                        addNewClient({...remoteUser, muted:true}, ()=>{
                            if(audioElements.current[remoteUser._id]){
                                audioElements.current[remoteUser._id].srcObject = remoteStream
                            }else{
                                let settled = false
                                const interval = setInterval(()=>{
                                    if(audioElements.current[remoteUser._id]){
                                        audioElements.current[remoteUser._id].srcObject = remoteStream
                                        settled = true
                                    }
                                    if(settled){
                                        clearInterval(interval);
                                    }
                                },1000)
                            }
                        })
                    }
            
                    // Add local track to remote track
                    localMediaStream.current.getTracks().forEach((track)=>{
                        connections.current[peerId].addTrack(track, localMediaStream.current)
                    })
            
            
                    // create offer
                    if(createOffer){
                        const offer = await connections.current[peerId].createOffer();
                        await connections.current[peerId].setLocalDescription(offer)
                        // send offer
                        socket.current.emit(ACTIONS.RELAY_SDP,{
                            peerId,
                            sessionDescription:offer
                        })
                    }
            
               }

               async function handleRemovePeer({peerId, userId}){
                    if(connections.current[peerId]){
                        connections.current[peerId].close();
                    }
        
                    delete connections.current[peerId];
                    delete audioElements.current[peerId];
                    setClients(list => list.filter(client => client._id !== userId))
               }

               async function handleRemoteSDP({peerId, sessionDescription: remoteSessionDescription}){

                connections.current[peerId].setRemoteDescription(
                    new RTCSessionDescription(remoteSessionDescription)
                )

                // if sessionDescription is typeOf offer create answer
                if(remoteSessionDescription.type === 'offer'){
                    const connection = connections.current[peerId];
                    const answer = await connection.createAnswer();

                    connection.setLocalDescription(answer);

                    socket.current.emit(ACTIONS.RELAY_SDP,{peerId, sessionDescription: answer})
                }

           }

           async function setMute(flag, peerId, userId){
                    
            const clientIdx = clientsRef.current.map((client) => client._id).indexOf(userId);
            

            const connectedClients = JSON.parse(JSON.stringify(clientsRef.current));
            if(clientIdx > -1){
                connectedClients[clientIdx].muted = flag
                setClients(connectedClients);
            }

        
   }

//    if (connections.current) {
//     observerRefValue = connections.current;
//   }
//   if(audioElements.current){
//    observerRefValue2 = audioElements.current
//   }


            };
            initChat();
            return () => {
                localMediaStream.current.getTracks().forEach(track => track.stop());
                socket.current.emit(ACTIONS.LEAVE,{roomId})
                for(let peerId in connections.current){
                    connections.current[peerId].close();
                    delete connections.current[peerId];
                    delete audioElements.current[peerId];
                }

                socket.current.off(ACTIONS.ADD_PEER);
                socket.current.off(ACTIONS.ICE_CANDIDATE);
                socket.current.off(ACTIONS.SESSION_DESCRIPTION);
                socket.current.off(ACTIONS.REMOVE_PEER);
                socket.current.off(ACTIONS.MUTE);
                socket.current.off(ACTIONS.UNMUTE);

            }
       },[addNewClient, roomId, setClients, user])



    //    useEffect(()=>{
    //     socket.current = socketInit();
    // },[])


    const provideRef = (instance,userId) => {
        audioElements.current[userId] = instance
   }


       useEffect(()=>{
           const setMute = (flag, peerId, userId) => {
                    
                    const clientIdx = clientsRef.current.map((client) => client._id).indexOf(userId);
                    

                    const connectedClients = JSON.parse(JSON.stringify(clientsRef.current));
                    if(clientIdx > -1){
                        connectedClients[clientIdx].muted = flag
                        setClients(connectedClients);
                    }

                
           }
            socket.current.on(ACTIONS.MUTE,({peerId, userId})=>{
                
                setMute(true, peerId, userId);
            })
            socket.current.on(ACTIONS.UNMUTE,({peerId, userId})=>{
                
                setMute(false, peerId, userId);
            })
       },[setClients])

       const handleMute = (isMute, userId) =>{ 
            
        let settled = false;
            let interval = setInterval(()=>{
                if(localMediaStream.current){
                    localMediaStream.current.getTracks()[0].enabled = !isMute;
                    if(isMute){
                        socket.current.emit(ACTIONS.MUTE,{
                            roomId,
                            userId
                        })
                    }else {
                        socket.current.emit(ACTIONS.UNMUTE,{
                            roomId,
                            userId
                        })
                    }
                    settled=true;
                }
                if(settled){
                    clearInterval(interval)
                }
            },200)
          
       }



       // capture media

    //    useEffect(()=>{
    //         const startCapture = async() => {
    //             localMediaStream.current = await navigator.mediaDevices.getUserMedia({
    //                 audio: true
    //             })
    //         }
    //         startCapture().then(()=>{
    //             addNewClient({
    //                 ...user, muted:true
    //             }, () => {
    //                 const localElement = audioElements.current[user._id];
    //                 if(localElement){
                        // localElement.volume = 0;
            //             localElement.srcObject = localMediaStream.current;
            //         }

            //         socket.current.emit(ACTIONS.JOIN,{roomId, user});

            //     })
            // })

            // return ()=>{
    //             //leave room
    //             localMediaStream.current.getTracks().forEach(track => track.stop());
    //             socket.current.emit(ACTIONS.LEAVE,{roomId})
    //         }

    //    },[])


    //    useEffect(()=>{

            
    //    const handleNewPeer = async({peerId, createOffer, user: remoteUser}) => {
    //     if(peerId in connections.current){
    //         return console.warn(`you arer already connected with ${peerId}`)
    //     }

    //     connections.current[peerId] = new RTCPeerConnection({
    //         iceServers: freeice()
    //     });

        //handle new iceCandidate
        // connections.current[peerId].onicecandidate = (e) => {
        //     socket.current.emit(ACTIONS.RELAY_ICE,{
        //         peerId,
        //         icecandidate: e.candidate
        //     })
        // }

        //Handle on track on this connection
        // connections.current[peerId].ontrack = ({
        //     streams: [remoteStream]
        // }) => {
        //     addNewClient({...remoteUser, muted:true}, ()=>{
        //         if(audioElements.current[remoteUser._id]){
        //             audioElements.current[remoteUser._id].srcObject = remoteStream
        //         }else{
        //             let settled = false
        //             const interval = setInterval(()=>{
        //                 if(audioElements.current[remoteUser._id]){
        //                     audioElements.current[remoteUser._id].srcObject = remoteStream
        //                     settled = true
        //                 }
        //                 if(settled){
        //                     clearInterval(interval);
        //                 }
        //             },1000)
        //         }
        //     })
        // }

        // Add local track to remote track
        // localMediaStream.current.getTracks().forEach((track)=>{
        //     connections.current[peerId].addTrack(track, localMediaStream.current)
        // })


        // create offer
//         if(createOffer){
//             const offer = await connections.current[peerId].createOffer();
//             await connections.current[peerId].setLocalDescription(offer)
//             // send offer
//             socket.current.emit(ACTIONS.RELAY_SDP,{
//                 peerId,
//                 sessionDescription:offer
//             })
//         }

//    }

//             socket.current.on(ACTIONS.ADD_PEER,handleNewPeer)
//             return () => {
//                 socket.current.off(ACTIONS.ADD_PEER);
//             }
//        },[clients])

       // handle iceCandidate
    //    useEffect(()=>{
      
    //         socket.current.on(ACTIONS.ICE_CANDIDATE,({peerId, icecandidate})=>{
    //             if(icecandidate){
    //                 connections.current[peerId].addIceCandidate(icecandidate);
    //             }
    //         })

    //         return () => {
    //             socket.current.off(ACTIONS.ICE_CANDIDATE);
    //         }
    //    },[])

       //handle SDP
//        useEffect(()=>{
//            const handleRemoteSDP = async({peerId, sessionDescription: remoteSessionDescription})=>{

//                 connections.current[peerId].setRemoteDescription(
//                     new RTCSessionDescription(remoteSessionDescription)
//                 )

//                 // if sessionDescription is typeOf offer create answer
//                 if(remoteSessionDescription.type === 'offer'){
//                     const connection = connections.current[peerId];
//                     const answer = await connection.createAnswer();

//                     connection.setLocalDescription(answer);

//                     socket.current.emit(ACTIONS.RELAY_SDP,{peerId, sessionDescription: answer})
//                 }

//            }
//         socket.current.on(ACTIONS.SESSION_DESCRIPTION,handleRemoteSDP)

//         return () => {
//             socket.current.off(ACTIONS.SESSION_DESCRIPTION);
//         }
//    },[])


//    useEffect(()=>{
//        const handleRemovePeer = async({peerId, userId}) => {
//             if(connections.current[peerId]){
//                 connections.current[peerId].close();
//             }

//             delete connections.current[peerId];
//             delete audioElements.current[peerId];
//             setClients(list => list.filter(client => client._id != userId))


//        }

//         socket.current.on(ACTIONS.REMOVE_PEER, handleRemovePeer);

//     return () => {
//         socket.current.off(ACTIONS.REMOVE_PEER);
//     };
//    },[])


    return {clients,provideRef, handleMute} ;
}