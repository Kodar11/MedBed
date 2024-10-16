import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

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


// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Starting the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export { app };
