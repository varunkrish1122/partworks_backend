import { Router } from 'express';
import { userRoutes } from './userRoutes';
class Routes {
  public readonly router: Router;

  constructor() {
    this.router = Router();
    this.applicationRoutes();
  }
  private applicationRoutes = () => {
    this.router.use('/users', userRoutes.router);
  };
}

export default new Routes();
