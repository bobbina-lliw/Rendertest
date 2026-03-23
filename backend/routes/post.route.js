import {Router} from 'express';
import {createPosts,getPosts,updatePosts,deletePosts} from '../controllers/post.controller.js'

const router = Router();

router.route("/createPosts").post(createPosts);
router.route('/getPosts').get(getPosts);
router.route('/updatePosts/:id').patch(updatePosts);
router.route('/deletePosts/:id').delete(deletePosts);

export default router;