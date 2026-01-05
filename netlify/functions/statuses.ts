import { neon } from "@netlify/neon";
import type { Context } from "@netlify/functions";

interface WeeklyStatus {
  id: string;
  memberId: string;
  memberName: string;
  weekStart: string;
  ragStatus: "red" | "amber" | "green";
  workActivities: string;
  customerActivities: string;
  submittedAt: string;
}

interface DbStatus {
  id: string;
  member_id: string;
  member_name: string;
  week_start: string;
  rag_status: "red" | "amber" | "green";
  work_activities: string;
  customer_activities: string;
  submitted_at: string;
}

// Convert snake_case DB response to camelCase for frontend
function toFrontendFormat(dbRow: DbStatus): WeeklyStatus {
  return {
    id: dbRow.id,
    memberId: dbRow.member_id,
    memberName: dbRow.member_name,
    weekStart: dbRow.week_start,
    ragStatus: dbRow.rag_status,
    workActivities: dbRow.work_activities,
    customerActivities: dbRow.customer_activities,
    submittedAt: dbRow.submitted_at,
  };
}

export default async function handler(req: Request, context: Context) {
  const sql = neon();
  const url = new URL(req.url);
  const method = req.method;

  try {
    // GET /api/statuses - Get all statuses with optional time range filter
    if (method === "GET") {
      const range = url.searchParams.get("range") || "all";

      let dateFilter = "";
      const now = new Date();

      if (range === "week") {
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay());
        dateFilter = weekStart.toISOString().split("T")[0];
      } else if (range === "month") {
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        dateFilter = monthStart.toISOString().split("T")[0];
      } else if (range === "quarter") {
        const quarterMonth = Math.floor(now.getMonth() / 3) * 3;
        const quarterStart = new Date(now.getFullYear(), quarterMonth, 1);
        dateFilter = quarterStart.toISOString().split("T")[0];
      }

      let statuses: DbStatus[];
      if (dateFilter && range !== "all") {
        statuses = await sql`
          SELECT id, member_id, member_name, week_start::text, rag_status, work_activities, customer_activities, submitted_at
          FROM weekly_statuses
          WHERE week_start >= ${dateFilter}::date
          ORDER BY submitted_at DESC
        ` as DbStatus[];
      } else {
        statuses = await sql`
          SELECT id, member_id, member_name, week_start::text, rag_status, work_activities, customer_activities, submitted_at
          FROM weekly_statuses
          ORDER BY submitted_at DESC
        ` as DbStatus[];
      }

      return Response.json(statuses.map(toFrontendFormat));
    }

    // POST /api/statuses - Create a new status update
    if (method === "POST") {
      const body = await req.json();
      const { memberId, memberName, weekStart, ragStatus, workActivities, customerActivities } = body;

      if (!memberId || !memberName || !weekStart || !ragStatus || !workActivities || !customerActivities) {
        return Response.json({ error: "All fields are required" }, { status: 400 });
      }

      if (!["red", "amber", "green"].includes(ragStatus)) {
        return Response.json({ error: "Invalid RAG status" }, { status: 400 });
      }

      const result = await sql`
        INSERT INTO weekly_statuses (member_id, member_name, week_start, rag_status, work_activities, customer_activities)
        VALUES (${memberId}, ${memberName}, ${weekStart}::date, ${ragStatus}, ${workActivities}, ${customerActivities})
        RETURNING id, member_id, member_name, week_start::text, rag_status, work_activities, customer_activities, submitted_at
      ` as DbStatus[];

      return Response.json(toFrontendFormat(result[0]), { status: 201 });
    }

    // DELETE /api/statuses?id=xxx - Delete a status
    // DELETE /api/statuses?all=true - Delete all statuses
    if (method === "DELETE") {
      const id = url.searchParams.get("id");
      const deleteAll = url.searchParams.get("all");

      if (deleteAll === "true") {
        await sql`DELETE FROM weekly_statuses`;
        return Response.json({ success: true, message: "All statuses cleared" });
      }

      if (!id) {
        return Response.json({ error: "ID is required (or use ?all=true to delete all)" }, { status: 400 });
      }

      const result = await sql`
        DELETE FROM weekly_statuses WHERE id = ${id} RETURNING id
      `;

      if (result.length === 0) {
        return Response.json({ error: "Status not found" }, { status: 404 });
      }

      return Response.json({ success: true });
    }

    return Response.json({ error: "Method not allowed" }, { status: 405 });
  } catch (error) {
    console.error("Database error:", error);
    return Response.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export const config = {
  path: "/api/statuses",
};
