import { Router } from 'express';
import { Authenticate, RequireAdmin } from '../middleware/auth.middleware';
import userController from '../controllers/user.controller';
import { validate } from '../middleware/validation.middleware';
import { CreateUserDto, UpdateUserDto } from '../dto/user.dto';

const router = Router();

router.use(Authenticate, RequireAdmin);

router.get   ('/',     userController.getAll.bind(userController));
router.post  ('/',     validate(CreateUserDto), userController.create.bind(userController));
router.get   ('/:id',  userController.getById.bind(userController));
router.put   ('/:id',  validate(UpdateUserDto), userController.update.bind(userController));
router.delete('/:id',  userController.remove.bind(userController));

export default router;