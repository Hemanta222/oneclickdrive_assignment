import "server-only";
import { getDb } from "@/lib/db";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(req) {
  const JWT_SECRET = process.env.JWT_SECRET;

  try {
    const body = await req.json();

    const { email, password } = body;

    if (!email || !password) {
      return new Response(
        JSON.stringify({ message: "Email and password are required" }),
        { status: 400 }
      );
    }
    const db = await getDb();

    const user = await db.get(
      "SELECT * FROM users WHERE (email, password) = (?, ?)",
      [email, password]
    );

    if (!user) {
      return new Response(JSON.stringify({ message: "Invalid credentials" }), {
        status: 400,
      });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
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

    return new Response(JSON.stringify({ message: "Login successful" }), {
      status: 200,
    });
  } catch (error) {
    console.log("login error", error);
    return new Response(
      JSON.stringify({ message: "Something went wrong, please try again" }),
      { status: 500 }
    );
  }
}
