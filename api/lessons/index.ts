import { VercelRequest, VercelResponse } from "@vercel/node";
import { extractAndVerifyToken, sendError } from "../../lib/auth";

export default async (req: VercelRequest, res: VercelResponse) => {
    res.setHeader("Content-Type", "application/json");
    try {
        const user = extractAndVerifyToken(req as any);
        if (!user) return sendError(res, 401, "Unauthorized");
        if (req.method === "POST") {
            // TODO: Create lesson with PDF upload (admin only)
            return res.json({ message: "Create lesson" });
        }
        if (req.method === "DELETE") {
            // TODO: Delete lesson (admin only)
            return res.json({ message: "Delete lesson" });
        }
        return sendError(res, 405, "Method not allowed");
    } catch (err) {
        console.error(err);
        return sendError(res, 500, "Internal server error");
    }
};
