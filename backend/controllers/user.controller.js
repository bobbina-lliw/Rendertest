import {User} from "../models/users.model.js"
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
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
            {"username":user.username},
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

const getProfile = async(req,res)=>{
    try{
        return res.status(200).json({message:"Everything ok"});
    }catch(error){
        res.status(500).json({message: "Internal server error"});
        return;
    }
}

export{
    registerUser,
    loginUser,
    logoutuser,
    getProfile
}