import mongoose, { Schema} from "mongoose";

const bedCount = new Schema (
    {
        hospital_id : {
            type:String,
            index:true
        },
        counter : {
            type : Number
        }
    }
)

export const BedCount = mongoose.model("BedCount",bedCount);