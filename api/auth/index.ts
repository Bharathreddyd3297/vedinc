import { VercelRequest, VercelResponse } from "@vercel/node";
import { z } from "zod";
import { supabase } from "../../lib/supabase";
import { signToken } from "../../lib/jwt";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

const hashPassword = async (password: string) => bcrypt.hash(password, SALT_ROUNDS);
const comparePassword = async (password: string, hash: string) => bcrypt.compare(password, hash);

const loginSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});

const signupSchema = z.object({
    name: z.string().min(5, "Name must be at least 5 characters").max(50, "Name too long").trim(),
    email: z.string().email("Invalid email format").toLowerCase(),
    password: z.string().min(8, "Password must be at least 8 characters").max(100, "Password too long"),
});

const findUserByEmail = async (email: string) => {
    const { data } = await supabase.from("User").select("*").eq("email", email).maybeSingle();
    return data;
};

const createUser = async (name: string, email: string, passwordHash: string, role: string) => {
    const { data } = await supabase
        .from("User")
        .insert({ name, email, passwordHash, role })
        .select("*")
        .single();
    return data;
};

const loginUser = async (email: string, password: string) => {
    const user = await findUserByEmail(email);
    if (!user) throw new Error("Invalid credentials");
    const isValid = await comparePassword(password, user.passwordHash);
    if (!isValid) throw new Error("Invalid credentials");
    return { id: user.id, name: user.name, email: user.email, role: user.role };
};

const handleLogin = async (req: VercelRequest, res: VercelResponse) => {
    try {
        const body = loginSchema.parse(req.body);
        const user = await loginUser(body.email, body.password);
        const token = signToken({ id: user.id, role: user.role });
        return res.json({ message: "Login successful", token, user });
    } catch (err) {
        if (err instanceof z.ZodError) {
            return res.status(400).json({ message: err.errors[0].message });
        }
        return res.status(401).json({ message: "Invalid email or password" });
    }
};

const handleSignup = async (req: VercelRequest, res: VercelResponse) => {
    try {
        const body = signupSchema.parse(req.body);
        const exists = await findUserByEmail(body.email);
        if (exists) return res.status(409).json({ message: "Email already exists" });
        const passwordHash = await hashPassword(body.password);
        const user = await createUser(body.name, body.email, passwordHash, "USER");
        const token = signToken({ id: user.id, role: user.role });
        return res.status(201).json({
            message: "Signup successful",
            token,
            user: { id: user.id, name: user.name, email: user.email, role: user.role },
        });
    } catch (err) {
        if (err instanceof z.ZodError) {
            return res.status(400).json({ message: err.errors[0].message });
        }
        console.error(err);
        return res.status(500).json({ message: "Signup failed" });
    }
};

export default async (req: VercelRequest, res: VercelResponse) => {
    res.setHeader("Content-Type", "application/json");
    if (req.method === "POST") {
        const action = req.query.action as string;
        if (action === "login") return handleLogin(req, res);
        if (action === "signup") return handleSignup(req, res);
        return res.status(400).json({ message: "Invalid action" });
    }
    return res.status(405).json({ message: "Method not allowed" });
};
