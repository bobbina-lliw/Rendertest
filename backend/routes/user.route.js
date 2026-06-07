import {Router} from 'express';
import {loginUser, registerUser,logoutuser,getProfile1} from '../controllers/user.controller.js'
import {middleware} from '../../middleware.js'

const router = Router();

router.route('/registerYURENDONODDOS').post(registerUser);

router.route('/login').post(loginUser);
router.route('/logout').post(logoutuser);
router.route('/profile1').get(middleware,getProfile1);


export default router;