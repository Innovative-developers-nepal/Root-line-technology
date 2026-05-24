import asyncHandler from "../utils/asyncHandler";
import sendSuccess from "../utils/responseHandler";
import { AuthRequest } from "../middlewares/auth.middleware";
import * as userService from "../services/user.service";
import { parsePagination, buildPaginationMeta } from "../utils/paginator";

export const getAllUsers = asyncHandler(async (req: AuthRequest, res) => {
    const pagination = parsePagination(req.query);
    const users = await userService.fetchAllUsers(pagination);
    const paginationMeta = buildPaginationMeta(users, pagination.limit);
    sendSuccess(res, 200, users, { pagination: paginationMeta });
});

export const createUser = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, password, roleName } = req.body;
    const user = await userService.createNewUser(firstName, lastName, email, password, roleName);
    sendSuccess(res, 201, user);
});

export const getUserById = asyncHandler(async (req: AuthRequest, res) => {
    const user = await userService.fetchUserById(req.params.id as string);
    sendSuccess(res, 200, user);
});

export const updateUser = asyncHandler(async (req: AuthRequest, res) => {
    const { firstName, lastName, email, avatar, password } = req.body;
    const user = await userService.updateUserById(
        req.params.id as string,
        req.user!.id,
        req.user!.roleName,
        { firstName, lastName, email, avatar, password }
    );
    sendSuccess(res, 200, user);
});

export const deleteUser = asyncHandler(async (req: AuthRequest, res) => {
    const user = await userService.deleteUserById(req.params.id as string, req.user!.id, req.user!.roleName);
    sendSuccess(res, 200, user);
});
