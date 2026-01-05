import { useState, useMemo } from 'react';
import { TimeRange, WeeklyStatus, TeamMember } from '@/types/status';
import { mockStatuses } from '@/data/mockData';
import { StatusForm } from '@/components/StatusForm';
import { TeamMemberCard } from '@/components/TeamMemberCard';
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard';
import { TimeRangeSelector } from '@/components/TimeRangeSelector';
import { EditStatusDialog } from '@/components/EditStatusDialog';
import { DeleteConfirmDialog } from '@/components/DeleteConfirmDialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { BarChart3, ClipboardList, Plus, Settings } from 'lucide-react';
import { toast } from 'sonner';

interface IndexProps {
  teamMembers: TeamMember[];
}

const Index = ({ teamMembers }: IndexProps) => {
  const [statuses, setStatuses] = useState<WeeklyStatus[]>(mockStatuses);
  const [timeRange, setTimeRange] = useState<TimeRange>('month');
  const [editingStatus, setEditingStatus] = useState<WeeklyStatus | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingStatusId, setDeletingStatusId] = useState<string | null>(null);

  const handleSubmitStatus = (newStatus: Omit<WeeklyStatus, 'id' | 'submittedAt'>) => {
    const status: WeeklyStatus = {
      ...newStatus,
      id: crypto.randomUUID(),
      submittedAt: new Date().toISOString(),
    };
    setStatuses((prev) => [status, ...prev]);
  };

  const handleEditStatus = (status: WeeklyStatus) => {
    setEditingStatus(status);
    setEditDialogOpen(true);
  };

  const handleSaveEdit = (updatedStatus: WeeklyStatus) => {
    setStatuses((prev) =>
      prev.map((s) => (s.id === updatedStatus.id ? updatedStatus : s))
    );
  };

  const handleDeleteClick = (statusId: string) => {
    setDeletingStatusId(statusId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deletingStatusId) {
      setStatuses((prev) => prev.filter((s) => s.id !== deletingStatusId));
      toast.success('Status update deleted');
      setDeletingStatusId(null);
    }
    setDeleteDialogOpen(false);
  };

  const deletingStatus = deletingStatusId
    ? statuses.find((s) => s.id === deletingStatusId)
    : null;

  const currentWeekStatuses = useMemo(() => {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const weekStartStr = weekStart.toISOString().split('T')[0];

    return statuses.filter((s) => s.weekStart === weekStartStr);
  }, [statuses]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">Team Pulse</h1>
              <p className="text-sm text-muted-foreground">Weekly status updates & workload analytics</p>
            </div>
            <div className="flex items-center gap-3">
              <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
              <Link to="/team">
                <Button variant="outline" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container py-8">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="dashboard" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="updates" className="gap-2">
              <ClipboardList className="h-4 w-4" />
              <span className="hidden sm:inline">Updates</span>
            </TabsTrigger>
            <TabsTrigger value="submit" className="gap-2">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Submit</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6 animate-fade-in">
            <AnalyticsDashboard statuses={statuses} timeRange={timeRange} />
          </TabsContent>

          <TabsContent value="updates" className="animate-fade-in">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Current Week Status</h2>
                <span className="text-sm text-muted-foreground">
                  {currentWeekStatuses.length} of {teamMembers.length} submitted
                </span>
              </div>
              
              {currentWeekStatuses.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {currentWeekStatuses.map((status) => (
                    <TeamMemberCard
                      key={status.id}
                      status={status}
                      onEdit={handleEditStatus}
                      onDelete={handleDeleteClick}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-border bg-muted/30 p-12 text-center">
                  <ClipboardList className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-medium">No updates this week</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Be the first to submit a status update!
                  </p>
                </div>
              )}

              {statuses.filter(s => !currentWeekStatuses.includes(s)).length > 0 && (
                <>
                  <h2 className="mt-8 text-lg font-semibold">Previous Updates</h2>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {statuses
                      .filter(s => !currentWeekStatuses.includes(s))
                      .slice(0, 6)
                      .map((status) => (
                        <TeamMemberCard
                          key={status.id}
                          status={status}
                          onEdit={handleEditStatus}
                          onDelete={handleDeleteClick}
                        />
                      ))}
                  </div>
                </>
              )}
            </div>
          </TabsContent>

          <TabsContent value="submit" className="animate-fade-in">
            <div className="mx-auto max-w-2xl">
              <StatusForm teamMembers={teamMembers} onSubmit={handleSubmitStatus} />
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <EditStatusDialog
        status={editingStatus}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={handleSaveEdit}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        memberName={deletingStatus?.memberName}
      />
    </div>
  );
};

export default Index;
