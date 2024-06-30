import mongoose from 'mongoose'
import { type } from 'os'
// import { type } from 'os'
// const { type } = require('os')

const AppUserSchema = mongoose.Schema({
    phoneNumber:{
        type:Number,
        required:true
    },

    name:{
        type:String,
        required:true
    },

    email:{
        type:String,
        required:true
    },

    role:{
        type:String,
        required:true
    }
})

export const AppUser = mongoose.model("AppUser",AppUserSchema)