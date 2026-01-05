import { useState, useEffect } from 'react';
import { RAGStatus, WeeklyStatus } from '@/types/status';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface EditStatusDialogProps {
  status: WeeklyStatus | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (status: WeeklyStatus) => void;
}

const ragOptions: { value: RAGStatus; label: string }[] = [
  { value: 'green', label: 'Green' },
  { value: 'amber', label: 'Amber' },
  { value: 'red', label: 'Red' },
];

export function EditStatusDialog({ status, open, onOpenChange, onSave }: EditStatusDialogProps) {
  const [ragStatus, setRagStatus] = useState<RAGStatus>('green');
  const [workActivities, setWorkActivities] = useState('');
  const [customerActivities, setCustomerActivities] = useState('');

  useEffect(() => {
    if (status) {
      setRagStatus(status.ragStatus);
      setWorkActivities(status.workActivities);
      setCustomerActivities(status.customerActivities);
    }
  }, [status]);

  const handleSave = () => {
    if (!status) return;

    if (!workActivities || !customerActivities) {
      toast.error('Please fill in all fields');
      return;
    }

    onSave({
      ...status,
      ragStatus,
      workActivities,
      customerActivities,
    });

    onOpenChange(false);
    toast.success('Status update saved!');
  };

  if (!status) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Status Update</DialogTitle>
          <DialogDescription>
            Modify the status update for {status.memberName} - Week of{' '}
            {new Date(status.weekStart).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
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

          <div className="space-y-2">
            <Label htmlFor="edit-work">Work Activities</Label>
            <Textarea
              id="edit-work"
              placeholder="Describe your main work activities this week..."
              value={workActivities}
              onChange={(e) => setWorkActivities(e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-customer">Customer-Facing Activities</Label>
            <Textarea
              id="edit-customer"
              placeholder="Describe your customer interactions this week..."
              value={customerActivities}
              onChange={(e) => setCustomerActivities(e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
