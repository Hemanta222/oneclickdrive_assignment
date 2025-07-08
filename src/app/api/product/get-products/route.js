import { getDb } from "@/lib/db";

export async function GET() {
    try {
        const db = await getDb()
        const products = await db.all('SELECT * FROM products')
        console.log('products', products)
        return new Response(JSON.stringify({ products: products }, {
            status: 200,
        }
        ))


    } catch (error) {
        console.log('----------error', error)
        return new Response(JSON.stringify({ message: 'Internal server error', error: error.message }, { status: 500, headers: { 'Content-Type': 'application/json' } }))
    }
} 