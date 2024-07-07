import React from 'react'
import io from 'socket.io-client'
import { useState,useEffect } from 'react'

function Rider() {

    const [socket,setSocket] = useState(null)
    const [socketId, setSocketId] = useState('');
    const [pass,setPass] = useState("")

    useEffect(()=>{
        const newSocket = io("http://localhost:3000",{
            transports: ["websocket"]
        })

        newSocket.on("connect",()=>{
            console.log("Rider connected")
            setSocketId(newSocket.id)
        })

        newSocket.on("rideRequestDetails", (details) => {
            console.log("Ride request details received:", details);
            // setRideDetails(details); // Store the ride details in state
        });

        

        newSocket.on("disconnect",()=>{
            console.log("Rider disconencted")
        })

        setSocket(newSocket);
        return () => {
            newSocket.disconnect();
        };
    },[])

    const acceptRide=()=>{
        if(socket)
            socket.emit("acceptRide", {requestId:pass,driverId:socketId})
        // console.log(socketId)

        socket.emit("facilitateComm",{driverId:socketId, passenger:pass})
    }

  return (
    <div>
        Rider
        <button 
        style={{backgroundColor:"green", padding:"5px",margin:"3px"}}
        onClick={acceptRide}>
            Accept Ride
        </button>

        <input onChange={(e)=>setPass(e.target.value)}/>
    </div>
  )
}

export default Rider
