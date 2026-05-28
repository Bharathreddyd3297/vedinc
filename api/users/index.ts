import { VercelRequest, VercelResponse } from "@vercel/node";
import { extractAndVerifyToken, sendError } from "../../../lib/auth";

export default async (req: VercelRequest, res: VercelResponse) => {
    res.setHeader("Content-Type", "application/json");

    try {
        const user = extractAndVerifyToken(req as any);

        if (req.method === "GET") {
            if (req.url?.includes("/me")) {
                if (!user) return sendError(res, 401, "Unauthorized");
                // TODO: Fetch user profile from database
                return res.json({ message: "Get user profile", userId: user.id });
            }
            return res.json({ message: "Get users list" });
        }

        if (req.method === "PUT") {
            if (!user) return sendError(res, 401, "Unauthorized");
            // TODO: Update user profile
            return res.json({ message: "Update user profile" });
        }

        return sendError(res, 405, "Method not allowed");
    } catch (err) {
        console.error(err);
        return sendError(res, 500, "Internal server error");
    }
};
