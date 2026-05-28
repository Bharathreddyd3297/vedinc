import { VercelRequest, VercelResponse } from "@vercel/node";
import { verifyToken, type TokenPayload } from "./jwt";

export interface AuthRequest extends VercelRequest {
    user?: TokenPayload;
}

export const extractAndVerifyToken = (req: AuthRequest): TokenPayload | null => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
        return null;
    }

    try {
        const token = authHeader.split(" ")[1];
        return verifyToken(token);
    } catch {
        return null;
    }
};

export const requireAuth = (req: AuthRequest): boolean => {
    return extractAndVerifyToken(req) !== null;
};

export const requireRole = (req: AuthRequest, ...roles: string[]): boolean => {
    const user = extractAndVerifyToken(req);
    return user !== null && roles.includes(user.role);
};

export const sendError = (
    res: VercelResponse,
    statusCode: number,
    message: string
): void => {
    res.status(statusCode).json({ message });
};
