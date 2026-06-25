import { Router } from 'express';
import * as blogController from '../controllers/blog';
import { requireAdmin } from '../middleware/auth';

const router = Router();

router.get('/posts', blogController.getPosts);
router.get('/posts/:slug', blogController.getPostBySlug);
router.post('/posts', requireAdmin, blogController.createPost);
router.put('/posts/:id', requireAdmin, blogController.updatePost);
router.delete('/posts/:id', requireAdmin, blogController.deletePost);
router.get('/categories', blogController.getCategories);

export default router;
