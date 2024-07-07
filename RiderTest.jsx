import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const RideTest = () => {
    const [socket, setSocket] = useState(null);
    const [socketId, setSocketId] = useState('');
    const [rideDetails, setRideDetails] = useState(null);

    useEffect(() => {
        const newSocket = io("http://localhost:3000", {
            transports: ["websocket"]
        });

        newSocket.on("connect", () => {
            console.log("Connected to socket");
            setSocketId(newSocket.id); // Store the socket id in state
        });

       

        newSocket.on("rideFound",(data)=>{
            console.log(data)
        })

        newSocket.on("error", (error) => {
            console.error("Socket error:", error);
        });

        newSocket.on("riderMessage",(data)=>{
            console.log(data)
        })

        newSocket.on("disconnect", () => {
            console.log("Disconnected from socket");
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, []);

    const requestRide = () => {
        if (socket && socketId) {
            // console.log("here ")
            socket.emit("rideRequest", { message: "Requesting ride", id: socketId });
        }
    };


    return (
        <div>
            <h1>RideTest</h1>

            <button
                style={{ backgroundColor: 'green', padding: 2 }}
                onClick={requestRide}>

                Request Ride
            </button>

        </div>
    );
};

export default RideTest;
