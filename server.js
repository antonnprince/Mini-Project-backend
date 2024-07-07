import express from 'express'
import mongoose from 'mongoose'
import { AppUser } from './models/Usermodel.js'
import {createServer} from 'http'
import {Server} from 'socket.io'
import cors from "cors"

const app = express()
app.use(express.json())
let rideRequests=[]
const httpServer = createServer(app)

const io = new Server(httpServer, {
    cors:{
        origin:"http://localhost:3001"
    }    
})

const MONGO_URI = "mongodb+srv://prompttest123:antonprince95@cluster0.asiy8fr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

mongoose.connect(MONGO_URI).then(() => {
    console.log("DB connected")
    httpServer.listen(3000, () => {
        console.log("Server Running at 3000")
    })
}).catch((error) => {
    console.log("ERROR: ", error)
})

app.post('/authenticate_user', async (req, res) => {
    try {
        const user = await AppUser.findOne({phoneNumber:req.body.phoneno})

        if(user)
            {
                console.log(user)
                return res.status(200).send(user)
            }
        else
            {
                const newUser={
                    phoneNumber:req.body.phoneno,
                    name:req.body.name,
                    email:req.body.email,
                    role:req.body.role
                }
                await AppUser.create(newUser)
                return res.status(200).json("User registered")    
            }
    } 
    catch (error) 
    {
        res.status(400).json(error)    
    }
})


// let rideRequests = []

io.on("connection", (socket) => {
    console.log("User connected");

    socket.on("rideRequest", (request) => {
        console.log("Received ride request:", request);
        rideRequests.push(request);
        io.emit("rideRequestDetails", rideRequests);
    });

    socket.on("acceptRide", ({driverId,requestId}) => {
        // console.log("Accepting ride for requestId:", requestId);
        const request = rideRequests.find((req) => req.id === requestId);
        
        if (request) 
        {
            console.log("Driver ",driverId," accepting request ",requestId)
            socket.to(requestId).emit("riderMessage","Hi this is rider")
            //  console.log("Found request:", request);
            //  io.to(driverId).emit("facilitateComm", {passenger: request.id})
            //  socket.join(request.id)
        } 
        else 
        {
            console.log("Request not found");
        }
    });

    // socket.on("facilitateComm",({passenger})=>{
    //     socket.join(passenger)

    // })

    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});
