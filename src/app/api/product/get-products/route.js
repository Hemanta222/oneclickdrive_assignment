import { getDb } from "@/lib/db";
import { withAuth } from "@/lib/withAuth";

 async function secretGet() {
    try {
        const db = await getDb()
        const products = await db.all('SELECT * FROM products')
        return new Response(JSON.stringify({ products: products }, {
            status: 200,
        }
        ))

    } catch (error) {
        console.log('----------error', error)
        return new Response(JSON.stringify({ message: 'Internal server error', error: error.message }, { status: 500, headers: { 'Content-Type': 'application/json' } }))
    }
} 

export const GET = withAuth(secretGet)