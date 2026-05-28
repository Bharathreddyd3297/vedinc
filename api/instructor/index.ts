import { VercelRequest, VercelResponse } from "@vercel/node";
import { extractAndVerifyToken, sendError } from "../../lib/auth";

export default async (req: VercelRequest, res: VercelResponse) => {
    res.setHeader("Content-Type", "application/json");
    try {
        if (req.method === "GET") {
            // TODO: Get instructors (public)
            return res.json({ message: "Get instructors" });
        }
        const user = extractAndVerifyToken(req as any);
        if (!user) return sendError(res, 401, "Unauthorized");
        if (req.method === "POST") {
            // TODO: Create instructor (admin only)
            return res.json({ message: "Create instructor" });
        }
        if (req.method === "PUT") {
            // TODO: Update instructor (admin only)
            return res.json({ message: "Update instructor" });
        }
        if (req.method === "DELETE") {
            // TODO: Delete instructor (admin only)
            return res.json({ message: "Delete instructor" });
        }
        return sendError(res, 405, "Method not allowed");
    } catch (err) {
        console.error(err);
        return sendError(res, 500, "Internal server error");
    }
};
