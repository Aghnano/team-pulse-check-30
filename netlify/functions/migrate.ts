import { neon } from "@netlify/neon";
import type { Context } from "@netlify/functions";

// This function runs the database migration
// You should run this once after deploying to set up the database schema
export default async function handler(req: Request, context: Context) {
  // Only allow POST requests for security
  if (req.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  const sql = neon();

  try {
    // Create team_members table
    await sql`
      CREATE TABLE IF NOT EXISTS team_members (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        role VARCHAR(255) NOT NULL,
        avatar VARCHAR(255),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;

    // Create weekly_statuses table (no foreign key constraint to allow flexibility)
    await sql`
      CREATE TABLE IF NOT EXISTS weekly_statuses (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        member_id VARCHAR(255) NOT NULL,
        member_name VARCHAR(255) NOT NULL,
        week_start DATE NOT NULL,
        rag_status VARCHAR(10) NOT NULL CHECK (rag_status IN ('red', 'amber', 'green')),
        work_activities TEXT NOT NULL,
        customer_activities TEXT NOT NULL,
        submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;

    // Drop foreign key constraint if it exists (from older schema versions)
    await sql`
      DO $$
      BEGIN
        ALTER TABLE weekly_statuses DROP CONSTRAINT IF EXISTS weekly_statuses_member_id_fkey;
      EXCEPTION WHEN OTHERS THEN
        NULL;
      END $$
    `;

    // Alter member_id column to VARCHAR if it's UUID (for existing databases)
    await sql`
      DO $$
      BEGIN
        ALTER TABLE weekly_statuses ALTER COLUMN member_id TYPE VARCHAR(255);
      EXCEPTION WHEN OTHERS THEN
        NULL;
      END $$
    `;

    // Create indexes
    await sql`CREATE INDEX IF NOT EXISTS idx_weekly_statuses_member_id ON weekly_statuses(member_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_weekly_statuses_week_start ON weekly_statuses(week_start)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_weekly_statuses_submitted_at ON weekly_statuses(submitted_at)`;

    // Insert initial team members if they don't exist
    await sql`
      INSERT INTO team_members (id, name, role) VALUES
        ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Alex Johnson', 'Frontend Developer'),
        ('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Sam Williams', 'Backend Developer'),
        ('c3d4e5f6-a7b8-9012-cdef-123456789012', 'Jordan Lee', 'Product Manager')
      ON CONFLICT (id) DO NOTHING
    `;

    return Response.json({
      success: true,
      message: "Database migration completed successfully",
    });
  } catch (error) {
    console.error("Migration error:", error);
    return Response.json(
      {
        error: "Migration failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export const config = {
  path: "/api/migrate",
};
