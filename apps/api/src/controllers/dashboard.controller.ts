import asyncHandler from '../utils/asyncHandler';
import sendSuccess from '../utils/responseHandler';
import * as dashboardService from '../services/dashboard.service';
import { AuthRequest } from '../middlewares/auth.middleware';

export const getDashboardStats = asyncHandler(async (req: AuthRequest, res) => {
    const stats = await dashboardService.getDashboardStats();
    sendSuccess(res, 200, stats);
});
