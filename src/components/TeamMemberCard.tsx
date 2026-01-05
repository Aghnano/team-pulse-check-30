import { WeeklyStatus } from '@/types/status';
import { RAGStatusBadge } from './RAGStatusBadge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { User, Briefcase, Users } from 'lucide-react';

interface TeamMemberCardProps {
  status: WeeklyStatus;
}

export function TeamMemberCard({ status }: TeamMemberCardProps) {
  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-card-hover animate-fade-in">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{status.memberName}</h3>
              <p className="text-sm text-muted-foreground">
                Week of {new Date(status.weekStart).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </p>
            </div>
          </div>
          <RAGStatusBadge status={status.ragStatus} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Briefcase className="h-4 w-4 text-muted-foreground" />
            Work Activities
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {status.workActivities}
          </p>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Users className="h-4 w-4 text-muted-foreground" />
            Customer Activities
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {status.customerActivities}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
