import { getDb } from "@/lib/db";
import { withAuth } from "@/lib/withAuth";

export async function secretPatch(req) {
    try {
        const body = await req.json();
        const { id, status } = body;
        console.log('-------------body', body)
        if (!id || !status) {
            return new Response({ message: 'Missing the required fields' }, { status: 400 })
        }

        const db = await getDb();
        const query = `UPDATE products SET status = ? WHERE id = ?`;
        const result = await db.run(query, [status, id]);
        console.log('post record', result)
        if (result.changes && result.changes > 0) {
            return new Response(JSON.stringify({ message: `The status of the product with id ${id} updated successfully`}, { status: 200,headers: { 'Content-Type': 'application/json' } }))
        } else {
            return new Response(JSON.stringify({ message: `Failed to update the status for the product id ${id}` }, { status: 400 }))
        }
    } catch (error) {
        console.log('----------error', error)
        return new Response(JSON.stringify({ message: 'Internal server error', error: error.message }, { status: 500, headers: { 'Content-Type': 'application/json' } }))
    }
} 

export const PATCH = withAuth(secretPatch)