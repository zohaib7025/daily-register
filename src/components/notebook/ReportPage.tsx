import { forwardRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { Trophy, Flame, Target, TrendingUp } from 'lucide-react';

interface Analytics {
  totalTasks: number;
  dailyCompletion: { day: number; completed: number; total: number; percentage: number }[];
  sectionBreakdown: { name: string; completed: number; total: number; percentage: number }[];
  currentStreak: number;
  longestStreak: number;
  overallCompletion: number;
  overallTotal: number;
  overallPercentage: number;
}

interface ReportPageProps {
  analytics: Analytics;
  totalDays: number;
}

const COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(142, 76%, 36%)', 'hsl(38, 92%, 50%)', 'hsl(280, 65%, 60%)'];

export const ReportPage = forwardRef<HTMLDivElement, ReportPageProps>(({ analytics, totalDays }, ref) => {
  const pieData = analytics.sectionBreakdown.map(s => ({
    name: s.name,
    value: s.completed,
  }));

  return (
    <div ref={ref} className="notebook-page page-curl min-h-[600px] rounded-sm overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-start pt-4 px-4 mb-4">
        <div className="pl-10">
          <span className="font-typewriter text-sm text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <TrendingUp size={16} />
            Analytics Report
          </span>
        </div>
      </div>

      <div className="pl-14 pr-4 pb-4 border-b-2 border-dashed border-muted-foreground/20">
        <h2 className="font-handwritten text-3xl font-bold text-foreground">
          Your Progress Overview
        </h2>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4 pt-4">
        <div className="bg-primary/10 rounded-lg p-4 text-center">
          <Target size={24} className="mx-auto text-primary mb-2" />
          <p className="font-handwritten text-3xl font-bold text-primary">{analytics.overallPercentage}%</p>
          <p className="font-typewriter text-xs text-muted-foreground">Overall</p>
        </div>
        <div className="bg-secondary rounded-lg p-4 text-center">
          <Trophy size={24} className="mx-auto text-primary mb-2" />
          <p className="font-handwritten text-3xl font-bold text-foreground">{analytics.overallCompletion}</p>
          <p className="font-typewriter text-xs text-muted-foreground">Tasks Done</p>
        </div>
        <div className="bg-accent/20 rounded-lg p-4 text-center">
          <Flame size={24} className="mx-auto text-accent-foreground mb-2" />
          <p className="font-handwritten text-3xl font-bold text-foreground">{analytics.currentStreak}</p>
          <p className="font-typewriter text-xs text-muted-foreground">Current Streak</p>
        </div>
        <div className="bg-muted rounded-lg p-4 text-center">
          <Flame size={24} className="mx-auto text-primary mb-2" />
          <p className="font-handwritten text-3xl font-bold text-foreground">{analytics.longestStreak}</p>
          <p className="font-typewriter text-xs text-muted-foreground">Best Streak</p>
        </div>
      </div>

      {/* Charts */}
      <div className="px-4 pt-6 space-y-6">
        {/* Daily Completion Chart */}
        <div className="bg-secondary/30 rounded-lg p-4">
          <h3 className="font-handwritten text-xl font-bold text-foreground mb-4">Daily Completion Rate</h3>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics.dailyCompletion.slice(0, 30)}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground) / 0.2)" />
                <XAxis 
                  dataKey="day" 
                  tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                  tickFormatter={(v) => `D${v}`}
                />
                <YAxis 
                  tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontFamily: 'var(--font-handwritten)',
                  }}
                  formatter={(value: number) => [`${value}%`, 'Completion']}
                  labelFormatter={(label) => `Day ${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="percentage" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 0, r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Section Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-secondary/30 rounded-lg p-4">
            <h3 className="font-handwritten text-xl font-bold text-foreground mb-4">Section Performance</h3>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.sectionBreakdown} layout="vertical">
                  <XAxis type="number" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                    width={80}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => [`${value}%`, 'Completion']}
                  />
                  <Bar dataKey="percentage" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-secondary/30 rounded-lg p-4">
            <h3 className="font-handwritten text-xl font-bold text-foreground mb-4">Tasks Distribution</h3>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={60}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-2 mt-2 justify-center">
              {analytics.sectionBreakdown.map((s, i) => (
                <span 
                  key={s.name}
                  className="font-typewriter text-xs flex items-center gap-1"
                >
                  <span 
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: COLORS[i % COLORS.length] }}
                  />
                  {s.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center">
        <span className="font-typewriter text-xs text-muted-foreground">
          — Report —
        </span>
      </div>
    </div>
  );
});

ReportPage.displayName = 'ReportPage';
