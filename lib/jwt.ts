import { sign, verify, Secret } from "jsonwebtoken";
import type { UserRole } from "./types";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
}

const JWT_EXPIRES_IN = "7d";

export type TokenPayload = {
    id: string;
    role: UserRole;
};

export const signToken = (payload: TokenPayload): string => {
    return sign(payload as object, JWT_SECRET as Secret, {
        expiresIn: JWT_EXPIRES_IN,
    });
};

export const verifyToken = (token: string): TokenPayload => {
    return verify(token, JWT_SECRET as Secret, {
        algorithms: ["HS256"],
    }) as TokenPayload;
};
