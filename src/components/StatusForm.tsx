import { useState } from 'react';
import { RAGStatus, TeamMember, WeeklyStatus } from '@/types/status';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Send, Thermometer } from 'lucide-react';
import { toast } from 'sonner';

interface StatusFormProps {
  teamMembers: TeamMember[];
  onSubmit: (status: Omit<WeeklyStatus, 'id' | 'submittedAt'>) => void;
}

const ragOptions: { value: RAGStatus; label: string; description: string }[] = [
  { value: 'green', label: 'Green - On Track', description: 'Workload is manageable' },
  { value: 'amber', label: 'Amber - Moderate', description: 'Some pressure, but okay' },
  { value: 'red', label: 'Red - High Load', description: 'Very busy, need support' },
];

export function StatusForm({ teamMembers, onSubmit }: StatusFormProps) {
  const [selectedMember, setSelectedMember] = useState<string>('');
  const [ragStatus, setRagStatus] = useState<RAGStatus | ''>('');
  const [workActivities, setWorkActivities] = useState('');
  const [customerActivities, setCustomerActivities] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedMember || !ragStatus || !workActivities || !customerActivities) {
      toast.error('Please fill in all fields');
      return;
    }

    const member = teamMembers.find(m => m.id === selectedMember);
    if (!member) return;

    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());

    onSubmit({
      memberId: selectedMember,
      memberName: member.name,
      weekStart: weekStart.toISOString().split('T')[0],
      ragStatus,
      workActivities,
      customerActivities,
    });

    // Reset form
    setSelectedMember('');
    setRagStatus('');
    setWorkActivities('');
    setCustomerActivities('');
    
    toast.success('Status update submitted!');
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Thermometer className="h-5 w-5 text-primary" />
          Submit Weekly Status
        </CardTitle>
        <CardDescription>
          Share your workload temperature and activities for this week
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="member">Team Member</Label>
              <Select value={selectedMember} onValueChange={setSelectedMember}>
                <SelectTrigger id="member">
                  <SelectValue placeholder="Select team member" />
                </SelectTrigger>
                <SelectContent>
                  {teamMembers.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>RAG Status</Label>
              <div className="flex gap-2">
                {ragOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setRagStatus(option.value)}
                    className={cn(
                      'flex-1 rounded-lg border-2 p-3 text-center transition-all',
                      ragStatus === option.value
                        ? option.value === 'green'
                          ? 'border-status-green bg-status-green-bg'
                          : option.value === 'amber'
                          ? 'border-status-amber bg-status-amber-bg'
                          : 'border-status-red bg-status-red-bg'
                        : 'border-border hover:border-muted-foreground/30'
                    )}
                  >
                    <div
                      className={cn(
                        'mx-auto mb-1 h-4 w-4 rounded-full',
                        option.value === 'green' && 'bg-status-green',
                        option.value === 'amber' && 'bg-status-amber',
                        option.value === 'red' && 'bg-status-red'
                      )}
                    />
                    <span className="text-xs font-medium capitalize">{option.value}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="work">Work Activities (2 sentences)</Label>
            <Textarea
              id="work"
              placeholder="Describe your main work activities this week..."
              value={workActivities}
              onChange={(e) => setWorkActivities(e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="customer">Customer-Facing Activities (2 sentences)</Label>
            <Textarea
              id="customer"
              placeholder="Describe your customer interactions this week..."
              value={customerActivities}
              onChange={(e) => setCustomerActivities(e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>

          <Button type="submit" className="w-full gap-2">
            <Send className="h-4 w-4" />
            Submit Status Update
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
