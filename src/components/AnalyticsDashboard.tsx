import { useMemo } from 'react';
import { WeeklyStatus, TimeRange } from '@/types/status';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { TrendingUp, Users, Calendar, Activity } from 'lucide-react';

interface AnalyticsDashboardProps {
  statuses: WeeklyStatus[];
  timeRange: TimeRange;
}

const COLORS = {
  green: 'hsl(142, 71%, 45%)',
  amber: 'hsl(38, 92%, 50%)',
  red: 'hsl(0, 72%, 51%)',
};

export function AnalyticsDashboard({ statuses, timeRange }: AnalyticsDashboardProps) {
  const analytics = useMemo(() => {
    const now = new Date();
    let cutoffDate = new Date();

    switch (timeRange) {
      case 'week':
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        cutoffDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        cutoffDate.setMonth(now.getMonth() - 3);
        break;
    }

    const filteredStatuses = statuses.filter(
      (s) => new Date(s.submittedAt) >= cutoffDate
    );

    // RAG distribution
    const ragCounts = { green: 0, amber: 0, red: 0 };
    filteredStatuses.forEach((s) => ragCounts[s.ragStatus]++);

    const ragData = [
      { name: 'On Track', value: ragCounts.green, color: COLORS.green },
      { name: 'Moderate', value: ragCounts.amber, color: COLORS.amber },
      { name: 'High Load', value: ragCounts.red, color: COLORS.red },
    ].filter((d) => d.value > 0);

    // Weekly trend data
    const weeklyData: Record<string, { week: string; green: number; amber: number; red: number }> = {};
    filteredStatuses.forEach((s) => {
      const weekKey = s.weekStart;
      if (!weeklyData[weekKey]) {
        weeklyData[weekKey] = { week: weekKey, green: 0, amber: 0, red: 0 };
      }
      weeklyData[weekKey][s.ragStatus]++;
    });

    const trendData = Object.values(weeklyData)
      .sort((a, b) => new Date(a.week).getTime() - new Date(b.week).getTime())
      .map((d) => ({
        ...d,
        week: new Date(d.week).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      }));

    // Summary stats
    const totalSubmissions = filteredStatuses.length;
    const avgHealth = totalSubmissions > 0
      ? ((ragCounts.green * 3 + ragCounts.amber * 2 + ragCounts.red * 1) / totalSubmissions).toFixed(1)
      : '0';
    const uniqueMembers = new Set(filteredStatuses.map((s) => s.memberId)).size;

    return {
      ragData,
      trendData,
      totalSubmissions,
      avgHealth,
      uniqueMembers,
      ragCounts,
    };
  }, [statuses, timeRange]);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-card animate-fade-in">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Updates</p>
                <p className="text-3xl font-bold">{analytics.totalSubmissions}</p>
              </div>
              <div className="rounded-full bg-primary/10 p-3">
                <Activity className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card animate-fade-in" style={{ animationDelay: '50ms' }}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Team Members</p>
                <p className="text-3xl font-bold">{analytics.uniqueMembers}</p>
              </div>
              <div className="rounded-full bg-status-green-bg p-3">
                <Users className="h-6 w-6 text-status-green" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card animate-fade-in" style={{ animationDelay: '100ms' }}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Health Score</p>
                <p className="text-3xl font-bold">{analytics.avgHealth}/3</p>
              </div>
              <div className="rounded-full bg-status-amber-bg p-3">
                <TrendingUp className="h-6 w-6 text-status-amber" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card animate-fade-in" style={{ animationDelay: '150ms' }}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">High Load Count</p>
                <p className="text-3xl font-bold">{analytics.ragCounts.red}</p>
              </div>
              <div className="rounded-full bg-status-red-bg p-3">
                <Calendar className="h-6 w-6 text-status-red" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-card animate-fade-in" style={{ animationDelay: '200ms' }}>
          <CardHeader>
            <CardTitle className="text-lg">Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {analytics.ragData.length > 0 ? (
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analytics.ragData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {analytics.ragData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        borderColor: 'hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex h-[250px] items-center justify-center text-muted-foreground">
                No data available
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-card animate-fade-in" style={{ animationDelay: '250ms' }}>
          <CardHeader>
            <CardTitle className="text-lg">Weekly Trend</CardTitle>
          </CardHeader>
          <CardContent>
            {analytics.trendData.length > 0 ? (
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.trendData}>
                    <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        borderColor: 'hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend />
                    <Bar dataKey="green" stackId="a" fill={COLORS.green} name="On Track" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="amber" stackId="a" fill={COLORS.amber} name="Moderate" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="red" stackId="a" fill={COLORS.red} name="High Load" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex h-[250px] items-center justify-center text-muted-foreground">
                No data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
