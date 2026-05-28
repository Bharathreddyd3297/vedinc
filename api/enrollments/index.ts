import { VercelRequest, VercelResponse } from "@vercel/node";
import { extractAndVerifyToken, sendError } from "../../lib/auth";

export default async (req: VercelRequest, res: VercelResponse) => {
    res.setHeader("Content-Type", "application/json");
    try {
        if (req.method === "GET") {
            if (req.url?.includes("/check/")) {
                // TODO: Check enrollment status (public)
                return res.json({ message: "Check enrollment status" });
            }
            // TODO: Get enrollments (authenticated)
            return res.json({ message: "Get enrollments" });
        }
        if (req.method === "POST") {
            if (req.url?.includes("/initiate")) {
                // TODO: Initiate enrollment (public)
                return res.json({ message: "Initiate enrollment" });
            }
            return sendError(res, 400, "Invalid endpoint");
        }
        const user = extractAndVerifyToken(req as any);
        if (!user) return sendError(res, 401, "Unauthorized");
        if (req.method === "DELETE") {
            // TODO: Delete enrollment (super_admin only)
            return res.json({ message: "Delete enrollment" });
        }
        return sendError(res, 405, "Method not allowed");
    } catch (err) {
        console.error(err);
        return sendError(res, 500, "Internal server error");
    }
};
