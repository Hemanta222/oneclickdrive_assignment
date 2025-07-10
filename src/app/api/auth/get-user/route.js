
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
const JWT_SECRET = process.env.JWT_SECRET
export async function GET(req) {


    try {
        // const cookies = req.headers.cookie || "";
        const token = (await cookies()).get('authToken')?.value;
        // console.log('------req.cookies', cookies)
        console.log('------req.token', token)

        if (!token) {
            return new Response(JSON.stringify({ message: 'Not authenticated' }), { status: 401 });
        }

        const decoded = jwt.verify(token, JWT_SECRET)
        return new Response(JSON.stringify({ user: { id: decoded.id, email: decoded.email } }), { status: 200 });
    } catch (error) {
        console.log('------error', error)
        return new Response(JSON.stringify({ message: "Invalid token" }), { status: 401 })
    }
}