import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from 'dotenv';
dotenv.config();

const app = express();

app.use(
    cors({
      origin: ["https://med-bed-kohl.vercel.app",
        "http://localhost:5173",
        "https://medbed-webhook.onrender.com"
      ],
      methods: ["GET", "POST", "DELETE", "UPDATE", "PUT"],
      credentials: true,
      // allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'device-remember-token', 'Access-Control-Allow-Origin', 'Origin', 'Accept']
    })
  );

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());    

// Routes import
import userRouter from './routes/user.routes.js';
import hospitalRouter from './routes/hospital.routes.js';
import userviewRouter from './routes/userview.routes.js';
import directionRouter from './routes/direction.routes.js';



// Routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/hospitals", hospitalRouter);
app.use("/api/v1/userview", userviewRouter);
app.use('/api/v1/direction', directionRouter);


// Starting the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export { app };
