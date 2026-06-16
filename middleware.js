//do middle ware later
import jwt from "jsonwebtoken";
import cors from "cors";
import express, { application } from "express";

const app = express();
app.use(cors());
app.use(express.json());

function refreshtokenvalidity(req, res, next) {
  try {
    const refreshtoken = req.body.refreshtoken;
    //console.log(refreshtoken);
    if (!refreshtoken) {
      return res.status(401).json({
        message: "Refresh token missing",
      });
    }

    const decoded = jwt.verify(refreshtoken, process.env.REFRESH_ACCESS_TOKEN, {
      algorithms: ["HS256"],
    });
    if (decoded) {
      next();
      return;
    }

    return res.status(401).json({ message: "Wrong Rrefresh Token" });
  } catch (error) {
    return res.status(401).json({ message: `Internal Sever Error` });
  }
}

function middleware(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header) {
      return res
        .status(401)
        .json({ message: "UnAuthorised Access" });
    }

    const token = header.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ message: "UnAuthorised Access" });
    }

    const accurate = jwt.verify(token, process.env.ACCESS_TOKEN, {
      algorithms: ["HS256"],
    });
    if (accurate) {
      req.user = accurate;
      next();
      return;
    }
    return res
      .status(401)
      .json({ message: "UnAuthorisedAccess" });
  } catch (error) {
    //console.log(`${error}`);
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        message: "Token expired",
      });
    }
    //console.log(`${error}`);
    res
      .status(500)
      .json({ message: "Internal server error" });
    return;
  }
}

export { middleware, refreshtokenvalidity };
