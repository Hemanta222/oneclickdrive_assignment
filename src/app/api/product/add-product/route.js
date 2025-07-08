import { getDb } from "@/lib/db";

export async function POST(req) {
    try {
        const body = await req.json();
        const { user_id, brand, model, year, mileage, price, currency, condition, } = body;
        console.log('-------------body', body)
        if (!user_id || !brand || !model || !year || !mileage || !price || !currency || !condition) {
            return new Response({ message: 'Missing the required fields' }, { status: 400 })

        }
        const db = await getDb()
        const result = await db.run('INSERT INTO products (user_id, brand, model, year, mileage, price, currency, condition, post_date, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [user_id, brand, model, year, mileage, price, currency, condition, new Date().toISOString(), 'pending']);
        console.log('post record', result)
        if (result.lastID) {
            const insertedId = result.lastID;
            const insertedRecord = await db.get('SELECT * FROM products WHERE id = ?', [insertedId])
            return new Response(JSON.stringify({ message: 'product added successfully', product: insertedRecord }, { status: 201, headers: { 'Content-Type': 'application/json' } }))

        } else {
            return new Response(JSON.stringify({ message: 'Failed to retrive the record' }, { status: 500 }))

        }
    } catch (error) {
        console.log('----------error', error)
        return new Response(JSON.stringify({ message: 'Internal server error', error: error.message }, { status: 500, headers: { 'Content-Type': 'application/json' } }))
    }
} 