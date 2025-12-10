import { Sidebar } from "@/components/layout/Sidebar";
import { StatCard } from "@/components/dashboard/StatCard";
import { DailySignupsChart, UserEngagementChart, CountryGenderChart } from "@/components/dashboard/Charts";
import { kpiData, signupsData, activeUserEngagementData, countryDistribution, topUsers, verificationQueue } from "@/lib/mockData";
import { 
  Users, 
  UserPlus, 
  Activity, 
  Crown, 
  HeartHandshake, 
  Scale, 
  ClipboardCheck, 
  UserX,
  Calendar as CalendarIcon,
  Globe,
  Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto h-screen">
        <div className="container mx-auto p-4 md:p-8 space-y-8">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Founder Dashboard</h2>
              <p className="text-muted-foreground">Overview of key metrics and user growth.</p>
            </div>
            
            <div className="flex items-center gap-2">
              <Select defaultValue="30d">
                <SelectTrigger className="w-[140px] bg-background">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Date Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="ytd">Year to Date</SelectItem>
                </SelectContent>
              </Select>
              
              <Select defaultValue="all">
                <SelectTrigger className="w-[140px] bg-background">
                  <Globe className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Countries</SelectItem>
                  <SelectItem value="in">India</SelectItem>
                  <SelectItem value="us">USA</SelectItem>
                  <SelectItem value="uk">UK</SelectItem>
                  <SelectItem value="ca">Canada</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* KPI Cards Row 1 */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <StatCard 
              title="Total Users" 
              value={kpiData.totalUsers.toLocaleString()} 
              icon={Users}
              trend={{ value: 12, label: "vs last month" }}
            />
            <StatCard 
              title="Signups Today" 
              value={kpiData.signupsToday} 
              icon={UserPlus}
              description="Daily average: 130"
            />
            <StatCard 
              title="Active 30D" 
              value={kpiData.active30d.toLocaleString()} 
              icon={Activity}
              trend={{ value: 5, label: "vs last month" }}
            />
            <StatCard 
              title="Active Premium" 
              value={kpiData.activePremium.toLocaleString()} 
              icon={Crown}
              trend={{ value: 8, label: "conversion rate" }}
            />
            <StatCard 
              title="Total Matches" 
              value={kpiData.totalMatches.toLocaleString()} 
              icon={HeartHandshake}
              description="3.6 matches per user"
            />
          </div>

          {/* KPI Cards Row 2 - Operational */}
          <div className="grid gap-4 md:grid-cols-3">
            <StatCard 
              title="Women : Men Ratio" 
              value={kpiData.womenMenRatio} 
              icon={Scale}
              description="Targeting 45:55"
              className="bg-primary/5 border-primary/20"
            />
            <StatCard 
              title="Verification Queue" 
              value={kpiData.verificationQueue} 
              icon={ClipboardCheck}
              description="Avg wait: 4 hours"
              className={kpiData.verificationQueue > 50 ? "border-amber-500/50 bg-amber-500/5" : ""}
            />
            <StatCard 
              title="Deactivated Users" 
              value={kpiData.deactivatedUsers} 
              icon={UserX}
              description="1.2% churn rate"
            />
          </div>

          {/* Charts Row */}
          <div className="grid gap-4 md:grid-cols-2">
            <DailySignupsChart data={signupsData} title="Daily Signups (30 Days)" />
            <UserEngagementChart data={activeUserEngagementData} title="DAU vs MAU (90 Days)" />
          </div>

          <div className="grid gap-4 md:grid-cols-7">
            {/* Bar Chart */}
            <div className="col-span-3">
               <CountryGenderChart data={countryDistribution} title="Active Users by Country & Gender" />
            </div>

            {/* Top Users Table */}
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Top 20 Most Active Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-auto h-[300px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Activity Score</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {topUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">
                            <div className="flex flex-col">
                              <span>{user.name}</span>
                              <span className="text-xs text-muted-foreground">{user.age} yrs</span>
                            </div>
                          </TableCell>
                          <TableCell>{user.location}</TableCell>
                          <TableCell>
                            <Badge variant={user.status === 'Premium' ? 'default' : 'secondary'}>
                              {user.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">{user.activityScore}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Verification Queue Table */}
          <Card>
            <CardHeader>
              <CardTitle>New Users Waiting Verification</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Documents</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {verificationQueue.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                           {user.name}
                           <Badge variant="outline" className="text-xs font-normal">Age {user.age}</Badge>
                        </div>
                      </TableCell>
                      <TableCell>{user.location}</TableCell>
                      <TableCell>{user.submitted}</TableCell>
                      <TableCell>{user.documents}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="outline" className="h-8 text-destructive hover:text-destructive">Reject</Button>
                          <Button size="sm" className="h-8">Verify</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
