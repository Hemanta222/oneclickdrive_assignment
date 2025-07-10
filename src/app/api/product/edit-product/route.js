import { getDb } from "@/lib/db";
import { withAuth } from "@/lib/withAuth";

export async function secretPut(req) {
    try {
        const body = await req.json();
        const { id, user_id, brand, model, year, mileage, price, currency, condition, status } = body;
        console.log('-------------body', body)
        if (!id || !user_id || !brand || !model || !year || !mileage || !price || !currency || !condition || !status) {
            return new Response(JSON.stringify({ message: 'Missing the required fields' }), { status: 400, headers: { 'Content-Type': 'application/json' } })
        }


        const db = await getDb();
        const query = `UPDATE products SET user_id = ?, brand = ?, model = ?, year = ?, mileage = ?, price = ?, currency = ?, condition = ?, status = ? WHERE id = ?`;
        const result = await db.run(query, [user_id, brand, model, year, mileage, price, currency, condition, status, id]);
        console.log('post record', result)
        if (result.changes && result.changes > 0) {
            return new Response(JSON.stringify({ message: `Product with id ${id} updated successfully` }, { status: 200, headers: { 'Content-Type': 'application/json' } }))
        } else {
            return new Response(JSON.stringify({ message: `Failed to update the product with id ${id}` }, { status: 400, headers: { 'Content-Type': 'application/json' } }))
        }
    } catch (error) {
        console.log('----------error', error)
        return new Response(JSON.stringify({ message: 'Internal server error', error: error.message }, { status: 500, headers: { 'Content-Type': 'application/json' } }))
    }
}

export const PUT = withAuth(secretPut)