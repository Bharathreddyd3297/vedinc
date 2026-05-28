import { VercelRequest, VercelResponse } from "@vercel/node";
import { extractAndVerifyToken, sendError } from "../../lib/auth";

export default async (req: VercelRequest, res: VercelResponse) => {
    res.setHeader("Content-Type", "application/json");
    try {
        const user = extractAndVerifyToken(req as any);
        if (!user) return sendError(res, 401, "Unauthorized");
        if (req.method === "POST") {
            // TODO: Create admin (super_admin only)
            return res.json({ message: "Create admin" });
        }
        if (req.method === "GET") {
            if (req.url?.includes("/users")) {
                // TODO: Get all users (super_admin only)
                return res.json({ message: "Get users" });
            }
            if (req.url?.includes("/enrollments")) {
                // TODO: Get all enrollments (super_admin only)
                return res.json({ message: "Get enrollments" });
            }
            return res.json({ message: "Admin endpoint" });
        }
        if (req.method === "PATCH" || req.method === "PUT") {
            // TODO: Update user role or other admin operations
            return res.json({ message: "Admin update" });
        }
        if (req.method === "DELETE") {
            // TODO: Delete user or enrollment
            return res.json({ message: "Admin delete" });
        }
        return sendError(res, 405, "Method not allowed");
    } catch (err) {
        console.error(err);
        return sendError(res, 500, "Internal server error");
    }
};
