import jwt, { JwtPayload } from "jsonwebtoken";
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

const privateKey = process.env.JWT_PRIVATE_KEY || "";
const expiresIn = process.env.JWT_EXPIRES_IN ?? "15m";

export const generateToken = (payload: any) => {
    return jwt.sign(payload, privateKey, { expiresIn: expiresIn as any });
};

export const decode = (token: string): JwtPayload => {
    return jwt.verify(token, privateKey) as JwtPayload;
};

export const generateRefreshToken = () => {
    return crypto.randomBytes(64).toString("hex");
};
