import { cookies } from "next/headers";

export  async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete("authToken");
  return new Response(JSON.stringify({ message: "Logout successful" }), {
    status: 200,
  });
}
