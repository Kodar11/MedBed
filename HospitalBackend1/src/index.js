import express from "express"
import mongoose from "mongoose"
import { BedCount } from "./hospital.schema.js"
import dotenv from "dotenv"

dotenv.config()

const app = express()

app.use(express.json({limit: "16kb"}))


const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`)
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {   
        console.log("MONGODB connection FAILED ", error);
        process.exit(1)
    }
}

app.post("/create",  async (req,res)=>{
    const { hospital_id,counter}  = req.body

    console.log("Hospital id : ",hospital_id);
    console.log("Counter : ",counter);
    
    if(!hospital_id) return res.status(400).send("Hospital_id is not entered")

    if(!counter) return res.status(401).send("Counter is not given!!")

    const existingHospital = await BedCount.findOne({hospital_id})

    if(existingHospital) return res.status(402).send("Hospital is already present")

    const createHospital = await BedCount.create({
        hospital_id,
        counter
    })

    if(!createHospital) return res.status(403).send("Something went wrong while creating hospital")

    return res.status(200).send("User created successfully");
})

app.post("/increment", async (req,res)=>{
    const {hospital_id} = req.body

    const hospital = await BedCount.findOne({hospital_id})

    hospital.counter = hospital.counter + 1;
    await hospital.save();

    console.log(hospital.counter);
    
    return res.status(200).send("Bed incremented successfully")
})

app.post("/decrement", async (req,res)=>{
    const {hospital_id} = req.body

    const hospital = await BedCount.findOne({hospital_id});

    if(hospital.counter < 1) return res.status(404).send("All beds are occupied");
    
    hospital.counter = hospital.counter -1
    await hospital.save();

    console.log(hospital.counter);

    return res.status(200).send("Bed decremented successfully")
    
})


connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
})



