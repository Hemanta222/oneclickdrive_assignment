import { getDb } from "@/lib/db";

export async function POST(req) {
    try {
        const body = await req.json();
        const { products } = body;
        console.log('-------------body', body)
        if (!Array.isArray(products) || products.length === 0) {
            return new Response(JSON.stringify({ message: 'Products must be in array format' }, { status: 400 }))

        }

        const db = await getDb()

        await db.run('BEGIN TRANSACTION')

        try {
            const stmt = await db.prepare('INSERT INTO products (user_id, brand, model, year, mileage, price, currency, condition, post_date, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
            for (const product of products) {
                await stmt.run(product.user_id, product.brand, product.model, product.year, product.mileage, product.price, product.currency, product.condition, new Date().toISOString(), 'pending')
            };
            await stmt.finalize()
            await db.run('COMMIT')

            return new Response(JSON.stringify({ message: 'products added successfully' }, { status: 201, headers: { 'Content-Type': 'application/json' } }))

        } catch (error) {
            await db.run('ROLLBACK');
            return new Response(JSON.stringify({ message: 'Internal server error', error: error.message }, { status: 500, headers: { 'Content-Type': 'application/json' } }))

        } finally {
            await db.close()
        }


    } catch (error) {
        console.log('----------error', error)
        return new Response(JSON.stringify({ message: 'Internal server error', error: error.message }, { status: 500, headers: { 'Content-Type': 'application/json' } }))
    }
} 