import { Router } from 'express';
import ProductController from '../controllers/product/product.controller';
import AuthController from '../controllers/auth/auth.controller';
import UserController from '../controllers/user/user.controller';

const router = Router();
const productController = new ProductController();
const authController = new AuthController(); // TODO: MOVE RESUED AUTH METHODS INTO MIDDLEWARE FOLDER
const userController = new UserController(); // TODO: MOVE RESUED USERID METHOD INTO MIDDLEWARE FOLDER

// Authorised Admin user can only create categories
router.post('/product/:userId',
  authController.authGuard,
  authController.isAuth,
  authController.isAdmin,
  productController.create
);

router.param('userId', userController.findById);

export default router;
