import { useState, useMemo } from 'react';
import { TimeRange, WeeklyStatus } from '@/types/status';
import { teamMembers, mockStatuses } from '@/data/mockData';
import { StatusForm } from '@/components/StatusForm';
import { TeamMemberCard } from '@/components/TeamMemberCard';
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard';
import { TimeRangeSelector } from '@/components/TimeRangeSelector';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, ClipboardList, Plus } from 'lucide-react';

const Index = () => {
  const [statuses, setStatuses] = useState<WeeklyStatus[]>(mockStatuses);
  const [timeRange, setTimeRange] = useState<TimeRange>('month');

  const handleSubmitStatus = (newStatus: Omit<WeeklyStatus, 'id' | 'submittedAt'>) => {
    const status: WeeklyStatus = {
      ...newStatus,
      id: crypto.randomUUID(),
      submittedAt: new Date().toISOString(),
    };
    setStatuses((prev) => [status, ...prev]);
  };

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
            <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
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
                    <TeamMemberCard key={status.id} status={status} />
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
                        <TeamMemberCard key={status.id} status={status} />
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
    </div>
  );
};

export default Index;
