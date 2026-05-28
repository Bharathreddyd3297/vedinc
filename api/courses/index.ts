import { VercelRequest, VercelResponse } from "@vercel/node";
import { extractAndVerifyToken, sendError } from "../../lib/auth";

export default async (req: VercelRequest, res: VercelResponse) => {
    res.setHeader("Content-Type", "application/json");
    try {
        if (req.method === "GET") {
            // TODO: Get all courses or specific course
            return res.json({ message: "Get courses" });
        }
        if (req.method === "POST") {
            const user = extractAndVerifyToken(req as any);
            if (!user) return sendError(res, 401, "Unauthorized");
            // TODO: Create course (admin only)
            return res.json({ message: "Create course" });
        }
        if (req.method === "PUT") {
            const user = extractAndVerifyToken(req as any);
            if (!user) return sendError(res, 401, "Unauthorized");
            // TODO: Update course (admin only)
            return res.json({ message: "Update course" });
        }
        if (req.method === "DELETE") {
            const user = extractAndVerifyToken(req as any);
            if (!user) return sendError(res, 401, "Unauthorized");
            // TODO: Delete course (admin only)
            return res.json({ message: "Delete course" });
        }
        return sendError(res, 405, "Method not allowed");
    } catch (err) {
        console.error(err);
        return sendError(res, 500, "Internal server error");
    }
};
