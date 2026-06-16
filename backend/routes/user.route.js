import express, {Router} from 'express';
import {loginUser, registerUser,logoutuser,getProfile1,getImager,getRcap,getSteam,getSen,getOther,getToken} from '../controllers/user.controller.js'
import {middleware,refreshtokenvalidity} from '../../middleware.js'
import rateLimit from "express-rate-limit";

const app = express();
const router = Router();

const globalLimitor = rateLimit({
    windowMs:1*60*1000,
    max:100,
    message:"DDOS NOT AVAILABLE TRY SMTH ELSE",
    standardHeaders:true,
    legacyHeaders: false,

    keyGenerator: (req,res)=>'global-api-limit',
})



router.route('/registerDONODDOS97aff521e00cc47b17dfd6577e752c588917b6df6cf25c8914179c26244b5e13a8a71951943ab7f3ee50f63d1525c332d4d26e35b005bbf2474a3cf6303f0093').post(registerUser);

router.route('/login').post(globalLimitor,loginUser);
router.route('/logout').post(logoutuser);
router.route('/profile1').get(middleware,getProfile1);
router.route('/imager').post(middleware,getImager);
router.route('/getRcap').post(middleware,getRcap);
router.route('/getSteam').post(middleware,getSteam);
router.route('/getSen').post(middleware,getSen);
router.route('/getOther').post(middleware,getOther);
router.route('/refresh').post(refreshtokenvalidity,getToken);

export default router;