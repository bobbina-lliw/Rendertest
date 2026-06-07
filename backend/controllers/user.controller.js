import {User} from "../models/users.model.js"
import jwt from "jsonwebtoken";
import path from "path"
import dotenv from "dotenv";
import { fileURLToPath } from 'node:url';//note this is important to import files from backend paths
import { dirname } from 'node:path';//important in order to access other things using dirname

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config();

const registerUser = async (req,res) => {
    try{
        const {username,password} = req.body;

        if(!username || !password){
            return res.status(400).json({message: "All fields are important!"})
        }

        const existing = await User.findOne({username: username.toLowerCase()})
        if(existing){
            return res.status(400).json({message: "User Already Exists!"});
        }

        const user = await User.create({
            username,
            password,
            loggedIn: false,
        });

        res.status(201).json({
            message: "Registered Successfully",
            user: {id: user._id,username: user.username}
        });

    } catch(error){
        res.status(500).json({message: "Internal Server Error", error: error.message});
    }
}


const loginUser = async(req,res) => {
    try{
        const {username,password} = req.body;

        const user = await User.findOne({
            username: username.toLowerCase()
        });

        if(!user){
            return res.status(400).json({
                message: "User not found"
            });
        }

        //compare passwords
        const isMatch = await user.comparePassword(password);
        if(!isMatch){
            return res.status(400).json({
                message: "Invalid Credentials",
                //password: user.password,
            })
        }


        const accessToken = jwt.sign(
            {"username":user.username,"User_id":user._id},
            process.env.ACCESS_TOKEN,
            {expiresIn: '5min'}//change later on
        );
        const refreshToken = jwt.sign(//refresh token prevents consistent signing in
            {"username":user.username},
            process.env.REFRESH_ACCESS_TOKEN,
            {expiresIn: '1d'}//change later on
        );
        
        res.status(200).json({
            message: "User Logged In",
            token: accessToken,
            user: {
                id: user._id,
                username: user.username,
            }
        })
        return;
    }catch(error){
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });

    }
}

const logoutuser = async (req,res) => {
    try{
        const {username} = req.body;

        const existing = await User.findOne({username: username.toLowerCase()});
        if(!existing){
            return res.status(404).json({message: "User not found!"});
        }
        res.status(200).json({message:"logout successful"});

    }catch(error){
        res.status(500).json({
            message: "Internal server error",error
        });
    }
}

const getProfile1 = async(req,res)=>{//get request ussed via auth token
    try{
            //console.log("sendin back")
            return res.sendFile(path.join(__dirname, "../Secure_pages/profile1.html"));

            
        }catch(error){
            console.log(path.join(__dirname, "../Secure_pages/profile1.html"));
            res.status(500).json({message: "Internal server error (Under GetProfile1)"});
            return;
        }
}

export{
    registerUser,
    loginUser,
    logoutuser,
    getProfile1
}