import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ChartProps {
  data: any[];
  title: string;
}

export function DailySignupsChart({ data, title }: ChartProps) {
  return (
    <Card className="col-span-1 border-none shadow-sm">
      <CardHeader className="bg-slate-50/50 border-b border-slate-100 rounded-t-xl pb-2">
        <CardTitle className="text-base font-semibold text-slate-800">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="date" 
                tickLine={false} 
                axisLine={false} 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                tickMargin={10}
              />
              <YAxis 
                tickLine={false} 
                axisLine={false} 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  borderColor: 'hsl(var(--border))',
                  borderRadius: 'var(--radius)',
                  color: 'hsl(var(--foreground))',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
              />
              <Line 
                type="linear" 
                dataKey="value" 
                stroke="hsl(var(--brand-navy))" 
                strokeWidth={2} 
                dot={{ r: 3, fill: 'hsl(var(--brand-navy))', strokeWidth: 0 }}
                activeDot={{ r: 5, fill: 'hsl(var(--brand-navy))' }}
              />
              {/* Second line for visual similarity to image */}
              <Line 
                type="linear" 
                dataKey={(d) => d.value * 0.8} 
                stroke="hsl(var(--brand-teal))" 
                strokeWidth={2} 
                dot={{ r: 3, fill: 'hsl(var(--brand-teal))', strokeWidth: 0 }}
                activeDot={{ r: 5, fill: 'hsl(var(--brand-teal))' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export function UserEngagementChart({ data, title }: ChartProps) {
  return (
    <Card className="col-span-1 border-none shadow-sm">
      <CardHeader className="bg-slate-50/50 border-b border-slate-100 rounded-t-xl pb-2">
        <CardTitle className="text-base font-semibold text-slate-800">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="date" 
                tickLine={false} 
                axisLine={false} 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                tickMargin={10}
                interval={12} 
              />
              <YAxis 
                tickLine={false} 
                axisLine={false} 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  borderColor: 'hsl(var(--border))',
                  borderRadius: 'var(--radius)',
                  color: 'hsl(var(--foreground))',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" />
              <Line 
                type="monotone" 
                dataKey="DAU" 
                name="Daily Active"
                stroke="hsl(var(--brand-teal))" 
                strokeWidth={2} 
                dot={{ r: 3, fill: 'hsl(var(--brand-teal))', strokeWidth: 0 }}
              />
              <Line 
                type="monotone" 
                dataKey="MAU" 
                name="Monthly Active"
                stroke="hsl(var(--brand-blue))" 
                strokeWidth={2} 
                dot={{ r: 3, fill: 'hsl(var(--brand-blue))', strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export function CountryGenderChart({ data, title }: ChartProps) {
  return (
    <Card className="col-span-1 border-none shadow-sm">
      <CardHeader className="bg-slate-50/50 border-b border-slate-100 rounded-t-xl pb-2">
        <CardTitle className="text-base font-semibold text-slate-800">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="name" 
                tickLine={false} 
                axisLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                tickMargin={10}
              />
              <YAxis 
                tickLine={false} 
                axisLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
              />
              <Tooltip 
                cursor={{ fill: 'hsl(var(--muted)/0.2)' }}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  borderColor: 'hsl(var(--border))',
                  borderRadius: 'var(--radius)',
                  color: 'hsl(var(--foreground))',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
              />
              <Legend verticalAlign="top" iconType="circle" />
              <Bar dataKey="women" name="Women" fill="hsl(var(--brand-navy))" radius={[2, 2, 0, 0]} barSize={20} />
              <Bar dataKey="men" name="Men" fill="hsl(var(--brand-teal))" radius={[2, 2, 0, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
