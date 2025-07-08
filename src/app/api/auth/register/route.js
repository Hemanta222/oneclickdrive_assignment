import { getDb } from "@/lib/db";

export  async function POST(req) {

    const body = await req.json()

    const { email, password } = body;

    if (!email || !password) {
        return new Response(JSON.stringify({ message: "Email and password are required" }), { status: 405 })
    }

    try {
        const db = await getDb()
        const existingUser = await db.get('SELECT * FROM users WHERE email = ?', [email])
        console.log('existingUser', existingUser)
        if (existingUser) {
            return new Response(JSON.stringify({ message: "The email address is already registered" }), { status: 409 })
        }

        await db.run('INSERT INTO users (email, password) VALUES (?, ?)', [email, password]);

        return new Response(JSON.stringify({ message: "Registration successfull" }), { status: 201 })

    } catch (error) {
        console.log('registration error', error)
        return new Response(JSON.stringify({ message: "Something went wrong. Please try again" }), { status: 500 })
    }
}