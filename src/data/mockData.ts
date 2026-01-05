import { TeamMember, WeeklyStatus } from '@/types/status';

export const teamMembers: TeamMember[] = [
  { id: '1', name: 'Sarah Chen', role: 'Senior Developer' },
  { id: '2', name: 'Marcus Johnson', role: 'Product Manager' },
  { id: '3', name: 'Emily Rodriguez', role: 'UX Designer' },
];

const generateWeekStart = (weeksAgo: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - date.getDay() - weeksAgo * 7);
  return date.toISOString().split('T')[0];
};

export const mockStatuses: WeeklyStatus[] = [
  // Current week
  {
    id: '1',
    memberId: '1',
    memberName: 'Sarah Chen',
    weekStart: generateWeekStart(0),
    ragStatus: 'amber',
    workActivities: 'Completed the API integration for the payment module. Started refactoring the authentication system for better security.',
    customerActivities: 'Had 2 client calls to discuss feature requirements. Presented the new dashboard design to stakeholders.',
    submittedAt: new Date().toISOString(),
  },
  {
    id: '2',
    memberId: '2',
    memberName: 'Marcus Johnson',
    weekStart: generateWeekStart(0),
    ragStatus: 'green',
    workActivities: 'Finalized Q1 roadmap and prioritized backlog items. Reviewed and approved 5 feature specifications.',
    customerActivities: 'Conducted 3 user interviews for the new feature. Prepared customer success report for leadership.',
    submittedAt: new Date().toISOString(),
  },
  {
    id: '3',
    memberId: '3',
    memberName: 'Emily Rodriguez',
    weekStart: generateWeekStart(0),
    ragStatus: 'red',
    workActivities: 'Delivered high-fidelity mockups for the mobile app redesign. Created design system documentation.',
    customerActivities: 'Ran 4 usability testing sessions with beta users. Presented design findings to the product team.',
    submittedAt: new Date().toISOString(),
  },
  // Last week
  {
    id: '4',
    memberId: '1',
    memberName: 'Sarah Chen',
    weekStart: generateWeekStart(1),
    ragStatus: 'green',
    workActivities: 'Deployed new caching layer improving performance by 40%. Fixed critical bug in the notification system.',
    customerActivities: 'Demo session with enterprise client. Answered technical questions from the sales team.',
    submittedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '5',
    memberId: '2',
    memberName: 'Marcus Johnson',
    weekStart: generateWeekStart(1),
    ragStatus: 'amber',
    workActivities: 'Sprint planning and retrospective sessions. Collaborated with engineering on technical debt reduction.',
    customerActivities: 'Customer onboarding call for new enterprise account. Quarterly business review preparation.',
    submittedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '6',
    memberId: '3',
    memberName: 'Emily Rodriguez',
    weekStart: generateWeekStart(1),
    ragStatus: 'green',
    workActivities: 'Completed accessibility audit and fixes. Started work on the component library updates.',
    customerActivities: 'Workshop with key customers on upcoming features. Design review with external consultants.',
    submittedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  // 2 weeks ago
  {
    id: '7',
    memberId: '1',
    memberName: 'Sarah Chen',
    weekStart: generateWeekStart(2),
    ragStatus: 'amber',
    workActivities: 'Database migration planning and testing. Code review sessions with junior developers.',
    customerActivities: 'Technical support escalation handling. API documentation walkthrough with partners.',
    submittedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '8',
    memberId: '2',
    memberName: 'Marcus Johnson',
    weekStart: generateWeekStart(2),
    ragStatus: 'red',
    workActivities: 'Crisis management for production issue. Emergency planning sessions with stakeholders.',
    customerActivities: 'Customer communication regarding service disruption. Compensation discussions with affected accounts.',
    submittedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '9',
    memberId: '3',
    memberName: 'Emily Rodriguez',
    weekStart: generateWeekStart(2),
    ragStatus: 'amber',
    workActivities: 'User flow optimization for checkout process. A/B test design for landing page variants.',
    customerActivities: 'Customer feedback synthesis from NPS surveys. Presented insights to marketing team.',
    submittedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
  // 3 weeks ago
  {
    id: '10',
    memberId: '1',
    memberName: 'Sarah Chen',
    weekStart: generateWeekStart(3),
    ragStatus: 'green',
    workActivities: 'New feature development for dashboard analytics. Unit test coverage improvements.',
    customerActivities: 'Technical webinar presentation. Partner integration support calls.',
    submittedAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '11',
    memberId: '2',
    memberName: 'Marcus Johnson',
    weekStart: generateWeekStart(3),
    ragStatus: 'green',
    workActivities: 'Product strategy sessions with leadership. Competitive analysis research.',
    customerActivities: 'Customer advisory board meeting. Renewal discussions with key accounts.',
    submittedAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '12',
    memberId: '3',
    memberName: 'Emily Rodriguez',
    weekStart: generateWeekStart(3),
    ragStatus: 'green',
    workActivities: 'Design sprint for new product initiative. Style guide updates and maintenance.',
    customerActivities: 'Customer journey mapping workshop. Brand consistency review with marketing.',
    submittedAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
  },
];
