import express, { application } from "express";
import cors from "cors";
import userRouter from './routes/user.route.js';
import postRouter from './routes/post.route.js';
import rateLimit from "express-rate-limit";

const app = express();//creates an express app

const globalLimitor = rateLimit({
    windowMs:1*60*1000,
    max:100,
    message:"DDOS NOT AVAILABLE TRY SMTH ELSE",
    standardHeaders:true,
    legacyHeaders: false,

    keyGenerator: (req,res)=>'global-api-limit',
})

app.use(globalLimitor);

app.use(cors());
app.use(express.json());

app.use("/api/v1/users",userRouter);
app.use("/api/v1/posts",postRouter);

// eg route: http://localhost:4000/api/v1/users/register


export default app;

