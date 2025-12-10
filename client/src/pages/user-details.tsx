import { Sidebar } from "@/components/layout/Sidebar";
import { useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  ShieldAlert, 
  Mail, 
  Phone, 
  Activity,
  CheckCircle2,
  XCircle,
  FileText
} from "lucide-react";
import { topUsers } from "@/lib/mockData";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

export default function UserDetails() {
  const [, params] = useRoute("/users/:id");
  const userId = params?.id ? parseInt(params.id) : 1;
  
  // Mock data fetch based on ID (using the topUsers list for simplicity)
  const user = topUsers.find(u => u.id === userId) || topUsers[0];

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto h-screen bg-slate-50/50">
        <div className="container mx-auto p-4 md:p-8 space-y-6">
          
          {/* Back Navigation */}
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
          </div>

          {/* User Header Profile */}
          <div className="flex flex-col md:flex-row gap-6 items-start justify-between bg-card p-6 rounded-xl shadow-sm border border-border/50">
            <div className="flex gap-6 items-center">
              <div className="h-24 w-24 rounded-full bg-gradient-to-br from-brand-blue to-brand-teal flex items-center justify-center text-white text-3xl font-bold shadow-inner">
                {user.name.charAt(0)}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold text-foreground">{user.name}</h1>
                  {user.verified && <ShieldCheck className="h-6 w-6 text-brand-teal" />}
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {user.location}</span>
                  <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> Age: {user.age}</span>
                  <span className="flex items-center gap-1">ID: #{userId.toString().padStart(6, '0')}</span>
                </div>
                <div className="pt-2 flex gap-2">
                   <Badge variant={user.status === 'Premium' ? 'default' : 'secondary'} className="bg-brand-blue hover:bg-brand-blue/90">
                     {user.status} Member
                   </Badge>
                   <Badge variant="outline" className={cn(
                     user.verified ? "text-brand-teal border-brand-teal/20 bg-brand-teal/5" : "text-amber-600 border-amber-600/20 bg-amber-50"
                   )}>
                     {user.verified ? "Verified Identity" : "Pending Verification"}
                   </Badge>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="border-destructive/30 text-destructive hover:bg-destructive/5 hover:text-destructive">
                <ShieldAlert className="h-4 w-4 mr-2" />
                Report User
              </Button>
              <Button className="bg-brand-blue hover:bg-brand-blue/90 text-white">
                <Mail className="h-4 w-4 mr-2" />
                Contact User
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column: Stats & Info */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Activity Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-brand-blue/10 rounded-full text-brand-blue">
                        <Activity className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-medium">Activity Score</span>
                    </div>
                    <span className="text-xl font-bold">{user.activityScore}/100</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg text-center">
                      <div className="text-2xl font-bold text-foreground">142</div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wide mt-1">Profile Views</div>
                    </div>
                    <div className="p-4 border rounded-lg text-center">
                      <div className="text-2xl font-bold text-foreground">28</div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wide mt-1">Matches</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>user.{userId}@example.com</span>
                    <Badge variant="secondary" className="ml-auto text-[10px]">Verified</Badge>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>+91 98765 43210</span>
                    <Badge variant="secondary" className="ml-auto text-[10px]">Verified</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Tabs for Details */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="verification" className="w-full">
                <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent gap-6">
                  <TabsTrigger 
                    value="verification" 
                    className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-brand-blue rounded-none px-0 py-3 text-muted-foreground data-[state=active]:text-foreground"
                  >
                    Verification Documents
                  </TabsTrigger>
                  <TabsTrigger 
                    value="preferences"
                    className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-brand-blue rounded-none px-0 py-3 text-muted-foreground data-[state=active]:text-foreground"
                  >
                    Partner Preferences
                  </TabsTrigger>
                  <TabsTrigger 
                    value="history"
                    className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-brand-blue rounded-none px-0 py-3 text-muted-foreground data-[state=active]:text-foreground"
                  >
                    Activity History
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="verification" className="pt-6 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Identity Verification</CardTitle>
                      <CardDescription>Review submitted documents for identity verification.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="border rounded-lg p-4 space-y-3">
                          <div className="flex justify-between items-start">
                             <div className="flex items-center gap-2 font-medium">
                               <FileText className="h-4 w-4 text-brand-blue" />
                               Govt ID (Aadhar/Passport)
                             </div>
                             <Badge className="bg-emerald-50 text-emerald-600 border-emerald-200">Auto-Verified</Badge>
                          </div>
                          <div className="aspect-video bg-slate-100 rounded-md flex items-center justify-center border-2 border-dashed border-slate-300">
                            <span className="text-muted-foreground text-sm">Document Preview</span>
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Uploaded: 2 days ago</span>
                            <span>Size: 2.4 MB</span>
                          </div>
                        </div>

                        <div className="border rounded-lg p-4 space-y-3">
                          <div className="flex justify-between items-start">
                             <div className="flex items-center gap-2 font-medium">
                               <FileText className="h-4 w-4 text-brand-blue" />
                               Selfie Verification
                             </div>
                             <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">Pending Review</Badge>
                          </div>
                          <div className="aspect-video bg-slate-100 rounded-md flex items-center justify-center border-2 border-dashed border-slate-300">
                            <span className="text-muted-foreground text-sm">Image Preview</span>
                          </div>
                          <div className="flex justify-end gap-2 pt-2">
                             <Button size="sm" variant="outline" className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10">Reject</Button>
                             <Button size="sm" className="h-8 bg-brand-teal hover:bg-brand-teal/90 text-white">Approve</Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="preferences" className="pt-6">
                   <Card>
                     <CardHeader><CardTitle>Partner Preferences</CardTitle></CardHeader>
                     <CardContent>
                       <p className="text-muted-foreground">User preferences data would go here...</p>
                     </CardContent>
                   </Card>
                </TabsContent>
                
                <TabsContent value="history" className="pt-6">
                   <Card>
                     <CardHeader><CardTitle>Activity Log</CardTitle></CardHeader>
                     <CardContent>
                       <p className="text-muted-foreground">User activity log would go here...</p>
                     </CardContent>
                   </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
