//do middle ware later
import jwt from "jsonwebtoken";

function middleware(req,res,next){
    try{
        const header = req.headers.authorization;
        if(!header){
            return res.status(401).json({message : "UnAuthorised Access"});
        }

        const token = header.split(" ")[1];
        if(!token){
            return res.status(401).json({message : "UnAuthorised Access(no token format)"});
        }

        const accurate = jwt.verify(token,process.env.ACCESS_TOKEN);
        if(accurate){
            next();
            return;
        }
        return res.status(401).json({message: "UnAuthorisedAccess invalid token"});

    }catch(error){
        res.status(400).json({message:"Internal server error"});
        return;
    }
}

export {middleware};