import mongoose from 'mongoose'
const TripSchema = mongoose.Schema({
            role:{
                type:String,
                required:true
            },

            source:{
                type:String,
                required:true
            },

            destination:{
                type:String,
                required:true
            },

            duration:{
                type:Number,
                required:true
            },

            fare:{
                type:Number,
                required:true
            },
        },

        {
            _id:false
        }

)

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

    trips:{
        type:[TripSchema],    
    }



})

export const AppUser = mongoose.model("AppUser",AppUserSchema)
