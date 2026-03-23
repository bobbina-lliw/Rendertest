import express, { application } from "express";
import cors from "cors";
import userRouter from './routes/user.route.js';
import postRouter from './routes/post.route.js';

const app = express();//creates an express app

app.use(cors());
app.use(express.json());

app.use("/api/v1/users",userRouter);
app.use("/api/v1/posts",postRouter);

// eg route: http://localhost:4000/api/v1/users/register


export default app;

