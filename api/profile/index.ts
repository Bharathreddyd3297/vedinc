import { VercelRequest, VercelResponse } from "@vercel/node";
import { extractAndVerifyToken, sendError } from "../../lib/auth";

export default async (req: VercelRequest, res: VercelResponse) => {
    res.setHeader("Content-Type", "application/json");
    try {
        const user = extractAndVerifyToken(req as any);
        if (!user) return sendError(res, 401, "Unauthorized");
        if (req.method === "GET") {
            // TODO: Get user profile
            return res.json({ message: "Get profile" });
        }
        if (req.method === "PUT") {
            // TODO: Update user profile
            return res.json({ message: "Update profile" });
        }
        return sendError(res, 405, "Method not allowed");
    } catch (err) {
        console.error(err);
        return sendError(res, 500, "Internal server error");
    }
};
