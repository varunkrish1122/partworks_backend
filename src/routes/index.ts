import { Router } from 'express';
class Routes {
    public readonly router: Router;

    constructor() {
        this.router = Router();
        this.applicationRoutes();
    }
    private applicationRoutes = () => {
    };
}

export default new Routes();
