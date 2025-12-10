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
  Download,
  ArrowRight,
  TrendingUp,
  UserCheck
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
import { Link } from "wouter";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto h-screen bg-slate-50/50">
        <div className="container mx-auto p-4 md:p-8 space-y-8">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground">Lahmee Founder Dashboard</h2>
              <p className="text-muted-foreground mt-1">Overview of key metrics and platform growth.</p>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-white rounded-md border shadow-sm p-1">
                <Button variant="ghost" size="sm" className="h-8 rounded-sm text-xs font-medium">Last 7 Days</Button>
                <Button variant="secondary" size="sm" className="h-8 rounded-sm text-xs font-medium bg-slate-100 text-slate-900">Last 30 Days</Button>
                <Button variant="ghost" size="sm" className="h-8 rounded-sm text-xs font-medium">Last 90 Days</Button>
              </div>
              
              <Select defaultValue="all">
                <SelectTrigger className="w-[140px] bg-white border-slate-200">
                  <Globe className="mr-2 h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Countries</SelectItem>
                  <SelectItem value="in">India</SelectItem>
                  <SelectItem value="us">USA</SelectItem>
                  <SelectItem value="uk">UK</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* KPI Cards Row 1 - High Level */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
            <StatCard 
              title="Total Users" 
              value={kpiData.totalUsers.toLocaleString()} 
              icon={TrendingUp}
              trend={{ value: 12 }}
              borderColor="blue"
            />
            <StatCard 
              title="Signups Today" 
              value={kpiData.signupsToday} 
              icon={UserPlus}
              trend={{ value: 8 }}
              borderColor="yellow"
            />
            <StatCard 
              title="Active 30D" 
              value={kpiData.active30d.toLocaleString()} 
              icon={Activity}
              trend={{ value: 5 }}
              borderColor="teal"
            />
            <StatCard 
              title="Active Premium" 
              value={kpiData.activePremium.toLocaleString()} 
              icon={Crown}
              trend={{ value: 8 }}
              borderColor="navy"
            />
            <StatCard 
              title="Total Matches" 
              value={kpiData.totalMatches.toLocaleString()} 
              icon={HeartHandshake}
              description="3.1M All time"
              borderColor="red"
            />
          </div>

          {/* KPI Cards Row 2 - Operational Ratios */}
          <div className="grid gap-6 md:grid-cols-4">
            <StatCard 
              title="Women : Men Ratio" 
              value="1.2 : 1" 
              icon={Scale}
              borderColor="blue"
              className="bg-blue-50/50"
            />
            <StatCard 
              title="Verification Queue" 
              value={kpiData.verificationQueue.toLocaleString()} 
              icon={ClipboardCheck}
              borderColor="default"
              className="bg-white"
            />
             <StatCard 
              title="Verified Users" 
              value="89,000" 
              icon={UserCheck}
              borderColor="navy"
              className="bg-white"
            />
            <StatCard 
              title="Deactivated Users" 
              value={kpiData.deactivatedUsers} 
              icon={UserX}
              borderColor="red"
              className="bg-red-50/50"
            />
          </div>

          {/* Charts Row */}
          <div className="grid gap-6 md:grid-cols-2">
            <DailySignupsChart data={signupsData} title="Daily Signups (30-90 days)" />
            <UserEngagementChart data={activeUserEngagementData} title="DAU vs MAU (last 90 days)" />
          </div>

          <div className="grid gap-6 md:grid-cols-7">
            {/* Bar Chart */}
            <div className="col-span-3">
               <CountryGenderChart data={countryDistribution} title="Active Users by Country & Gender" />
            </div>

            {/* Top Users Table */}
            <Card className="col-span-4 border-none shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2 bg-slate-50/50 border-b border-slate-100 rounded-t-xl">
                <CardTitle className="text-base font-semibold text-slate-800">Top 20 Most Active Users</CardTitle>
                <Button variant="ghost" size="sm" className="text-xs text-brand-blue hover:text-brand-blue/80">View All</Button>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-auto h-[320px]">
                  <Table>
                    <TableHeader className="bg-slate-50 sticky top-0 z-10">
                      <TableRow className="border-b border-slate-100 hover:bg-slate-50">
                        <TableHead className="w-[180px] font-medium text-slate-500">User</TableHead>
                        <TableHead className="font-medium text-slate-500">Location</TableHead>
                        <TableHead className="font-medium text-slate-500">Status</TableHead>
                        <TableHead className="text-right font-medium text-slate-500">Activity Score</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {topUsers.map((user) => (
                        <TableRow key={user.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                          <TableCell className="font-medium py-3">
                            <div className="flex flex-col">
                              <span className="text-slate-900 font-medium">{user.name}</span>
                              <span className="text-xs text-slate-400">ID: #{user.id.toString().padStart(4, '0')}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-slate-600">{user.location}</TableCell>
                          <TableCell>
                            <Badge variant={user.status === 'Premium' ? 'default' : 'secondary'} 
                                   className={user.status === 'Premium' ? "bg-brand-navy hover:bg-brand-navy/90" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}>
                              {user.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-medium text-slate-700">{user.activityScore}</TableCell>
                          <TableCell>
                            <Link href={`/users/${user.id}`}>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-brand-blue">
                                <ArrowRight className="h-4 w-4" />
                              </Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Verification Queue Table */}
          <Card className="border-none shadow-sm">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 rounded-t-xl pb-3">
              <CardTitle className="text-base font-semibold text-slate-800">New Users Waiting Verification</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow className="border-b border-slate-100 hover:bg-slate-50">
                    <TableHead className="font-medium text-slate-500">User ID</TableHead>
                    <TableHead className="font-medium text-slate-500">Name</TableHead>
                    <TableHead className="font-medium text-slate-500">Signup Date</TableHead>
                    <TableHead className="font-medium text-slate-500">Verification Status</TableHead>
                    <TableHead className="text-right font-medium text-slate-500">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {verificationQueue.map((user) => (
                    <TableRow key={user.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                      <TableCell className="font-mono text-xs text-slate-500">USR-{user.id}</TableCell>
                      <TableCell className="font-medium text-slate-900">{user.name}</TableCell>
                      <TableCell className="text-slate-600">{user.submitted}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">Pending Review</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                         <Link href={`/users/${user.id}`}>
                            <Button size="sm" variant="outline" className="h-8 text-slate-600 hover:text-brand-blue hover:border-brand-blue">
                              Review Details
                            </Button>
                         </Link>
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
