import { VercelRequest, VercelResponse } from "@vercel/node";

export default (req: VercelRequest, res: VercelResponse) => {
    res.json({ message: "API is healthy", timestamp: new Date().toISOString() });
};
