import { Router } from 'express';
import { getDashboardStats } from '../controllers/dashboard.controller';
import { authenticateToken } from '../middlewares/auth.middleware';
import { Permissions } from '../guards';
import { PERMISSIONS } from '../config/permissions';

const router = Router();

router.get('/',
    authenticateToken,
    Permissions(PERMISSIONS.ANALYTICS.resource, PERMISSIONS.ANALYTICS.actions.READ),
    getDashboardStats
);

export default router;

