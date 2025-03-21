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

let ph

app.post('/login', async (req, res) => {
    try 
    {
        const user = await AppUser.findOne({phoneNumber:req.body.phoneno})
        if(user)
            {
                return res.status(200).json(user)
            }
        else
            {
                ph=req.body.phoneno
                return res.status(404).json({message:"User not found"})
            }
    } 
    catch (error) 
    {
        res.status(400).json(error)    
    }
})


app.post('/register',async (req,res)=>{
    const newUser={
        phoneNumber:ph,   
        name:req.body.name,
        email:req.body.email,
        role:req.body.role,
        department:req.body.department,
        DOB:req.body.DOB,
        cusatID:req.body.cusatID,
        driverLicense:req.body.driverLicense
    }

    await AppUser.create(newUser)
    return res.status(200).json("User registered")   
})

app.post('/add_trip', async (req, res) => {
    const { phoneno, source, destination, duration, fare } = req.body;

    const tripObject = {
        source,
        destination,
        duration,
        fare
    };

    try {
        const user = await AppUser.findOneAndUpdate(
            { phoneNumber: phoneno },
            { $push: { trips: tripObject } },
            { new: true, useFindAndModify: false }
        );

        if (user) {
            return res.status(200).json({ message: "Updated successfully", user });
        } else {
            return res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});


io.on("connection", (socket) => {
    console.log("User connected");

    socket.on("rideRequest", (request) => {
        // console.log("Received ride request:", request);
        rideRequests.push(request);
        io.emit("rideRequestDetails", rideRequests);
    });

    socket.on("acceptRide", ({driverId,requestId}) => {
        const request = rideRequests.find((req) => req.id === requestId);
        
        if (request) 
        {
            
            socket.on("getRiderDetails",(data)=>{
                    socket.to(requestId).emit("riderMessage",data)
            })            
        } 
        else 
        {
            console.log("Request not found");
        }
    });

    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});
