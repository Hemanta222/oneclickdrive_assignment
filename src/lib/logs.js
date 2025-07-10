"use server";

import { getDb } from "./db";

export async function logAdminActions(params) {
  try {
    const { user_id, user_email, action_type, target_entity_id, details } =
      params;
    const db = await getDb();
    const query = `INSERT INTO audit_logs (user_id, user_email, action_type, target_entity_id, details) VALUES (?, ?, ?, ?, ?)`;
    await db.run(query, [
      user_id,
      user_email,
      action_type,
      target_entity_id,
      details ? JSON.stringify(details) : null,
    ]);
  } catch (error) {
    return {
      status: false,
      message: `Error in logging details :${error.message || error}`,
    };
  }
}

export async function getLogs() {
  try {
    const db = await getDb();
    const logs = await db.all(
      "SELECT * FROM audit_logs ORDER BY timestamps DESC"
    );
    const logData = logs.map((log) => ({
      ...log,
      details: log.details ? JSON.parse(log.details) : null,
    }));
    return { status: true, logs: logData };
  } catch (error) {
    return {
      status: false,
      message: `Error in fetching logs :${error.message || error}`,
    };
  }
}
