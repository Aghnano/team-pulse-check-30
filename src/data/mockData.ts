import { TeamMember, WeeklyStatus } from "@/types/status";

// Default team members - used as fallback when database is not available
export const teamMembers: TeamMember[] = [
  { id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890", name: "Alex Johnson", role: "Frontend Developer" },
  { id: "b2c3d4e5-f6a7-8901-bcde-f12345678901", name: "Sam Williams", role: "Backend Developer" },
  { id: "c3d4e5f6-a7b8-9012-cdef-123456789012", name: "Jordan Lee", role: "Product Manager" },
];

// Empty statuses - will be loaded from database
export const mockStatuses: WeeklyStatus[] = [];
