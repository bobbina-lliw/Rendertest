import {Router} from 'express';
import {loginUser, registerUser,logoutuser,getProfile1} from '../controllers/user.controller.js'
import {middleware} from '../../middleware.js'

const router = Router();

router.route('/registerYURENDONODDOS97aff521e00cc47b17dfd6577e752c588917b6df6cf25c8914179c26244b5e13a8a71951943ab7f3ee50f63d1525c332d4d26e35b005bbf2474a3cf6303f0093').post(registerUser);

router.route('/login').post(loginUser);
router.route('/logout').post(logoutuser);
router.route('/profile1').get(middleware,getProfile1);


export default router;