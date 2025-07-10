import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
const JWT_SECRET = process.env.JWT_SECRET
export function withAuth(handler) {
    return async (req, context) => {
              const token = (await cookies()).get('authToken')?.value;
        if (!token) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }
        const decoded = jwt.verify(token, JWT_SECRET)

        if (!decoded) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        return handler(req, context);

    }

}