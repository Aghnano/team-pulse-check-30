import { neon } from "@netlify/neon";
import type { Context } from "@netlify/functions";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar?: string;
}

export default async function handler(req: Request, context: Context) {
  const sql = neon();
  const url = new URL(req.url);
  const method = req.method;

  try {
    // GET /api/team-members - Get all team members
    if (method === "GET") {
      const members = await sql`SELECT id, name, role, avatar FROM team_members ORDER BY created_at ASC`;
      return Response.json(members);
    }

    // POST /api/team-members - Create a new team member
    if (method === "POST") {
      const body = await req.json();
      const { name, role, avatar } = body as Omit<TeamMember, "id">;

      if (!name || !role) {
        return Response.json({ error: "Name and role are required" }, { status: 400 });
      }

      const result = await sql`
        INSERT INTO team_members (name, role, avatar)
        VALUES (${name}, ${role}, ${avatar || null})
        RETURNING id, name, role, avatar
      `;
      return Response.json(result[0], { status: 201 });
    }

    // PUT /api/team-members?id=xxx - Update a team member
    if (method === "PUT") {
      const id = url.searchParams.get("id");
      if (!id) {
        return Response.json({ error: "ID is required" }, { status: 400 });
      }

      const body = await req.json();
      const { name, role, avatar } = body as Omit<TeamMember, "id">;

      if (!name || !role) {
        return Response.json({ error: "Name and role are required" }, { status: 400 });
      }

      const result = await sql`
        UPDATE team_members
        SET name = ${name}, role = ${role}, avatar = ${avatar || null}, updated_at = NOW()
        WHERE id = ${id}
        RETURNING id, name, role, avatar
      `;

      if (result.length === 0) {
        return Response.json({ error: "Team member not found" }, { status: 404 });
      }

      return Response.json(result[0]);
    }

    // DELETE /api/team-members?id=xxx - Delete a team member
    if (method === "DELETE") {
      const id = url.searchParams.get("id");
      if (!id) {
        return Response.json({ error: "ID is required" }, { status: 400 });
      }

      const result = await sql`
        DELETE FROM team_members WHERE id = ${id} RETURNING id
      `;

      if (result.length === 0) {
        return Response.json({ error: "Team member not found" }, { status: 404 });
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
  path: "/api/team-members",
};
