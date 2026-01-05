import { TeamMember, WeeklyStatus, TimeRange } from "@/types/status";

const API_BASE = "/api";

// Team Members API
export async function fetchTeamMembers(): Promise<TeamMember[]> {
  const response = await fetch(`${API_BASE}/team-members`);
  if (!response.ok) {
    throw new Error("Failed to fetch team members");
  }
  return response.json();
}

export async function createTeamMember(
  member: Omit<TeamMember, "id">
): Promise<TeamMember> {
  const response = await fetch(`${API_BASE}/team-members`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(member),
  });
  if (!response.ok) {
    throw new Error("Failed to create team member");
  }
  return response.json();
}

export async function updateTeamMember(
  id: string,
  member: Omit<TeamMember, "id">
): Promise<TeamMember> {
  const response = await fetch(`${API_BASE}/team-members?id=${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(member),
  });
  if (!response.ok) {
    throw new Error("Failed to update team member");
  }
  return response.json();
}

export async function deleteTeamMember(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/team-members?id=${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete team member");
  }
}

// Statuses API
export async function fetchStatuses(range?: TimeRange): Promise<WeeklyStatus[]> {
  const url = range
    ? `${API_BASE}/statuses?range=${range}`
    : `${API_BASE}/statuses`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch statuses");
  }
  return response.json();
}

export async function createStatus(
  status: Omit<WeeklyStatus, "id" | "submittedAt">
): Promise<WeeklyStatus> {
  const response = await fetch(`${API_BASE}/statuses`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(status),
  });
  if (!response.ok) {
    throw new Error("Failed to create status");
  }
  return response.json();
}

export async function deleteStatus(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/statuses?id=${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete status");
  }
}

export async function clearAllStatuses(): Promise<void> {
  const response = await fetch(`${API_BASE}/statuses?all=true`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to clear statuses");
  }
}

// Migration API - call this once to set up database tables
export async function runMigration(): Promise<{ success: boolean; message: string }> {
  const response = await fetch(`${API_BASE}/migrate`, {
    method: "POST",
  });
  return response.json();
}
