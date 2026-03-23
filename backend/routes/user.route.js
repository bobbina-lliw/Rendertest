import {Router} from 'express';
import {loginUser, registerUser,logoutuser,getProfile} from '../controllers/user.controller.js'
import {middleware} from '../../middleware.js'

const router = Router();

router.route('/register').post(registerUser);

router.route('/login').post(loginUser);
router.route('/logout').post(logoutuser);
router.route('/profile').get(middleware,getProfile);


export default router;