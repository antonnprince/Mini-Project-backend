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

io.on("connect",(socket)=>{
    console.log("User connected")
    // console.log(socket.id)

    socket.on("rideRequest",(request)=>{
        console.log(request)
        rideRequests.push(request)
        socket.emit("rideRequestDetails",rideRequests)
    })

    socket.on("disconnect",()=>{
        console.log("User disconnected")
    })
})
