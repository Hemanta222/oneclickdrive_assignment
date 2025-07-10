import { getDb } from "@/lib/db";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req) {
  const body = await req.json();

  const { email, password } = body;

  if (!email || !password) {
    return new Response(
      JSON.stringify({ message: "Email and password are required" }),
      { status: 405 }
    );
  }

  try {
    const db = await getDb();
    const existingUser = await db.get("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    console.log("existingUser", existingUser);
    if (existingUser) {
      return new Response(
        JSON.stringify({ message: "The email address is already registered" }),
        { status: 409 }
      );
    }

    const result = await db.run(
      "INSERT INTO users (email, password) VALUES (?, ?)",
      [email, password]
    );
    if (result.lastID) {
      const insertedId = result.lastID;

      const token = jwt.sign({ id: insertedId, email: email }, JWT_SECRET, {
        expiresIn: "1h",
      });

      const cookieStore = await cookies();

      cookieStore.set("authToken", token, {
        httpOnly: true,
        secure: true,
        maxAge: 60 * 60,
        sameSite: "strict",
        path: "/",
      });

      return new Response(
        JSON.stringify({ message: "Registration successfull" }),
        { status: 201 }
      );
    }
  } catch (error) {
    console.log("registration error", error);
    return new Response(
      JSON.stringify({ message: "Something went wrong. Please try again" }),
      { status: 500 }
    );
  }
}
