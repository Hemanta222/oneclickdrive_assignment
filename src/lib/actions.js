"use server";
import { revalidatePath } from "next/cache";
import { getDb } from "./db";

import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { logAdminActions } from "./logs";
const JWT_SECRET = process.env.JWT_SECRET;

async function getTokenDetails() {
  const token = (await cookies()).get("authToken")?.value;
  if (token) {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded) {
      return { user_id: decoded.id, user_email: decoded.email };
    } else {
      return null;
    }
  } else return null;
}

export async function getProducts() {
  try {
    const db = await getDb();
    const products = await db.all("SELECT * FROM products");
    if (!Array.isArray(products)) {
      return;
    } else return products;
  } catch (error) {
    return { success: false, message: error.message };
  }
}
export async function updateProductStatus(id, status) {
  try {
    if (!id || !status) {
      throw new Error("Error: missing the required fields");
    }
    const db = await getDb();
    const query = `UPDATE products SET status = ? WHERE id = ?`;
    const result = await db.run(query, [status, id]);

    if (result.changes && result.changes > 0) {
      const userDetails = await getTokenDetails();
      const params = {
        user_id: userDetails.user_id,
        user_email: userDetails.user_email,
        action_type: status,
        target_entity_id: id,
        details: { reason: "status change" },
      };
      await logAdminActions(params);

      revalidatePath("/dashboard");
      return {
        success: true,
        message: `The status of the product with id ${id} updated successfully`,
      };
    } else {
      return {
        success: false,
        message: `Failed to update the status for the product id ${id}`,
      };
    }
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function editProduct(productDetails) {
  try {
    const {
      id,
      user_id,
      brand,
      model,
      year,
      mileage,
      price,
      currency,
      condition,
      status,
    } = productDetails;
    if (
      !id ||
      !user_id ||
      !brand ||
      !model ||
      !year ||
      !mileage ||
      !price ||
      !currency ||
      !condition ||
      !status
    ) {
      return new Response(
        JSON.stringify({ message: "Missing the required fields" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const db = await getDb();
    const query = `UPDATE products SET user_id = ?, brand = ?, model = ?, year = ?, mileage = ?, price = ?, currency = ?, condition = ?, status = ? WHERE id = ?`;
    const result = await db.run(query, [
      user_id,
      brand,
      model,
      year,
      mileage,
      price,
      currency,
      condition,
      status,
      id,
    ]);
    if (result.changes && result.changes > 0) {
      const userDetails = await getTokenDetails();
      const params = {
        user_id: userDetails.user_id,
        user_email: userDetails.user_email,
        action_type: status,
        target_entity_id: id,
        details: { reason: "edit product" },
      };
      await logAdminActions(params);
      revalidatePath("/dashboard");
      return {
        success: true,
        message: `Product with id ${id} updated successfully`,
      };
    } else {
      return {
        success: false,
        message: `Failed to update the product with id ${id}.`,
      };
    }
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function login(email, password) {
  try {
    if (!email || !password) {
      return {
        success: false,
        message: `Invalid credentials`,
      };
    }
    const db = await getDb();

    const user = await db.get(
      "SELECT * FROM users WHERE (email, password) = (?, ?)",
      [email, password]
    );

    if (!user) {
      return {
        success: false,
        message: `Invalid credentials`,
      };
    }
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });

    const cookieStore = await cookies();

    cookieStore.set("authToken", token, {
      httpOnly: true,
      secure: true,
      maxAge: 60 * 60,
      sameSite: "strict",
      path: "/",
    });
    return {
      success: true,
      message: `Login successful`,
    };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function register(email, password) {
  try {
    if (!email || !password) {
      return {
        success: false,
        message: `Invalid credentials`,
      };
    }
    const db = await getDb();

    const existingUser = await db.get("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (existingUser) {
      return {
        success: false,
        message: "The email address is already registered",
      };
    }

    const result = await db.run(
      "INSERT INTO users (email, password) VALUES (?, ?)",
      [email, password]
    );
    if (result.lastID) {
      const insertedId = result.lastID;

      const token = jwt.sign({ id: insertedId, email: email }, JWT_SECRET, {
        expiresIn: "1h",
      });

      const cookieStore = await cookies();

      cookieStore.set("authToken", token, {
        httpOnly: true,
        secure: true,
        maxAge: 60 * 60,
        sameSite: "strict",
        path: "/",
      });

      return {
        success: true,
        message: `Signup successfully`,
      };
    }
  } catch (error) {
    return { success: false, message: error.message };
  }
}
export async function logout() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("authToken");

    revalidatePath("/");
    return {
      success: true,
      message: `logout successfully`,
    };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function getUserDetails() {
  try {
    const token = (await cookies()).get("authToken")?.value;
    if (!token) {
      return { success: false, message: "Not authenticated" };
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded) {
      return { success: false, message: "Authentication failed" };
    } else {
      return {
        status: true,
        user: { userId: decoded.id, email: decoded.email },
      };
    }
  } catch (error) {
    return { success: false, message: error.message };
  }
}
