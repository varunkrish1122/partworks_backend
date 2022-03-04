import { Router } from 'express';
import { UserController } from '../../controllers';
import { validate } from '../../middlewares/validations.middleware';

export class UserRoutes extends UserController {
  public readonly router: Router;

  constructor() {
    super();
    this.router = Router();
    this.userRoutes();
  }

  // Routes
  private userRoutes() {
    this.router.post('/signup', validate('createUser'), this.createUserAsync);
  }
}

export const userRoutes = new UserRoutes();
