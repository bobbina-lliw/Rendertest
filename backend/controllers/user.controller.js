import { User } from "../models/users.model.js";
import jwt from "jsonwebtoken";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "node:url"; //note this is important to import files from backend paths
import { dirname } from "node:path"; //important in order to access other things using dirname
import profile from "../Secure_pages/profile1.json" with { type: "json" };

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config();

const registerUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "All fields are important!" });
    }

    const existing = await User.findOne({ username: username.toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: "User Already Exists!" });
    }

    const user = await User.create({
      username,
      password,
      loggedIn: false,
    });

    res.status(201).json({
      message: "Registered Successfully",
      user: { id: user._id, username: user.username },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

const getToken = async (req, res) => {
  //gets the new access token
  try {
    const refreshtoken = req.body.refreshtoken;

    const decoded = jwt.verify(refreshtoken, process.env.REFRESH_ACCESS_TOKEN, {
      algorithms: ["HS256"],
    });
    const username = decoded.username;
    const user = await User.findOne({
      username: username.toLowerCase(),
    });

    const accessToken = jwt.sign(
      { username: user.username, User_id: user._id },
      process.env.ACCESS_TOKEN,
      {
        algorithm: "HS256",
        expiresIn: "5min",
      },
      //change later on
    );

    res.status(200).json({
      message: "User Logged In",
      accesstoken: accessToken,
      refreshtoken: refreshtoken,
      user: {
        id: user._id,
        username: user.username,
      },
    });

    return 
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({
      username: username.toLowerCase(),
    });

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    //compare passwords
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid Credentials",
        //password: user.password,
      });
    }

    const accessToken = jwt.sign(
      { username: user.username, User_id: user._id },
      process.env.ACCESS_TOKEN,
      {
        algorithm: "HS256",
        expiresIn: "30sec",
      },
      //change later on
    );
    const refreshToken = jwt.sign(
      //refresh token prevents consistent signing in
      { username: user.username },
      process.env.REFRESH_ACCESS_TOKEN,
      {
        algorithm: "HS256",
        expiresIn: "1d",
      }, //change later on
    );

    res.status(200).json({
      message: "User Logged In",
      accesstoken: accessToken,
      refreshtoken: refreshToken,
      user: {
        id: user._id,
        username: user.username,
      },
    });
    return;
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const logoutuser = async (req, res) => {
  //in future logout removes access token
  try {
    const { username } = req.body;

    const existing = await User.findOne({ username: username.toLowerCase() });
    if (!existing) {
      return res.status(404).json({ message: "User not found!" });
    }
    res.status(200).json({ message: "logout successful" });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error,
    });
  }
};

const getProfile1 = async (req, res) => {
  //get request ussed via auth token
  try {
    return res.status(200).json(profile);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error (Under GetProfile1)" });
    return;
  }
};

const getImager = async (req, res) => {
  //console.log("sent");
  const PictureID = req.body.PictureID;
  //console.log(PictureID);
  try {
    const filepath = path.join(
      __dirname,
      "../Secure_pages/images",
      PictureID, //change it to the db filename storage
    );
    res.sendFile(filepath);
    //console.log("sent");
    return;
  } catch (error) {
    res.status(500).json({ message: `internal sever error error: ${error}` });
  }
};

const getRcap = async (req, res) => {
  //console.log("sent");
  const PictureID = req.body.PictureID;
  try {
    const filepath = path.join(
      __dirname,
      "../Secure_pages/images/RCAP",
      PictureID, //change it to the db filename storage
    );
    res.sendFile(filepath);
    return;
  } catch (error) {
    res.status(500).json({ message: `internal sever error error: ${error}` });
  }
};

const getSteam = async (req, res) => {
  const PictureID = req.body.PictureID;
  //console.log(PictureID);
  try {
    const filepath = path.join(
      __dirname,
      "../Secure_pages/images/steamunity",
      PictureID, //change it to the db filename storage
    );
    res.sendFile(filepath);
    return;
  } catch (error) {
    res.status(500).json({ message: `internal sever error error: ${error}` });
  }
};

const getSen = async (req, res) => {
  //console.log("sent");
  const PictureID = req.body.PictureID;
  try {
    const filepath = path.join(
      __dirname,
      "../Secure_pages/images/sentinel",
      PictureID, //change it to the db filename storage
    );
    res.sendFile(filepath);

    return;
  } catch (error) {
    res.status(500).json({ message: `internal sever error error: ${error}` });
  }
};

const getOther = async (req, res) => {
  //console.log("sent");
  const PictureID = req.body.PictureID;
  try {
    const filepath = path.join(
      __dirname,
      "../Secure_pages/images/Otherachievements",
      PictureID, //change it to the db filename storage
    );
    res.sendFile(filepath);

    return;
  } catch (error) {
    res.status(500).json({ message: `internal sever error error: ${error}` });
  }
};

export {
  registerUser,
  loginUser,
  logoutuser,
  getProfile1,
  getImager,
  getRcap,
  getSteam,
  getSen,
  getOther,
  getToken,
};
