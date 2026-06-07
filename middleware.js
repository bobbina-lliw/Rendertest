//do middle ware later
import jwt from "jsonwebtoken";
import cors from "cors";
import express, { application } from "express";
const app = express();
app.use(cors());
app.use(express.json());

function middleware(req,res,next){
    try{
        const header = req.headers.authorization;
        if(!header){
            return res.status(401).json({message : "UnAuthorised Access (middleware)"});
        }

        const token = header.split(" ")[1];
        if(!token){
            return res.status(401).json({message : "UnAuthorised Access(no token format)"});
        }

        const accurate = jwt.verify(token,process.env.ACCESS_TOKEN);
        if(accurate){
            req.user = accurate;
            next();
            return;
        }
        return res.status(401).json({message: "UnAuthorisedAccess invalid token"});

    }catch(error){
        res.status(400).json({message:"Internal server error (Under middleware)"});
        return;
    }
}

export {middleware};