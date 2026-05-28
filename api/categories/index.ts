import { VercelRequest, VercelResponse } from "@vercel/node";
import { extractAndVerifyToken, sendError } from "../../lib/auth";

export default async (req: VercelRequest, res: VercelResponse) => {
    res.setHeader("Content-Type", "application/json");
    try {
        if (req.method === "GET") {
            // TODO: Get categories
            return res.json({ message: "Get categories" });
        }
        const user = extractAndVerifyToken(req as any);
        if (!user) return sendError(res, 401, "Unauthorized");
        if (req.method === "POST") {
            // TODO: Create category (admin only)
            return res.json({ message: "Create category" });
        }
        if (req.method === "DELETE") {
            // TODO: Delete category (admin only)
            return res.json({ message: "Delete category" });
        }
        return sendError(res, 405, "Method not allowed");
    } catch (err) {
        console.error(err);
        return sendError(res, 500, "Internal server error");
    }
};
