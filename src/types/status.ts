export type RAGStatus = 'red' | 'amber' | 'green';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar?: string;
}

export interface WeeklyStatus {
  id: string;
  memberId: string;
  memberName: string;
  weekStart: string;
  ragStatus: RAGStatus;
  workActivities: string;
  customerActivities: string;
  submittedAt: string;
}

export type TimeRange = 'week' | 'month' | 'quarter';
