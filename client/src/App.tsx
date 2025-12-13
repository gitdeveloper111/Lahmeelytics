import { Switch, Route, useLocation, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import UsersPage from "@/pages/users";
import UserDetailsPage from "@/pages/user-details";
import VerificationPage from "@/pages/verification";
import ReportsPage from "@/pages/reports";
import LoginPage from "@/pages/login";

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  // TEMPORARILY DISABLED FOR TESTING - uncomment below to re-enable login
  // const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  // if (!isLoggedIn) {
  //   return <Redirect to="/login" />;
  // }
  
  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/login" component={LoginPage} />
      <Route path="/">
        <ProtectedRoute component={Dashboard} />
      </Route>
      <Route path="/users">
        <ProtectedRoute component={UsersPage} />
      </Route>
      <Route path="/users/:id">
        <ProtectedRoute component={UserDetailsPage} />
      </Route>
      <Route path="/verification">
        <ProtectedRoute component={VerificationPage} />
      </Route>
      <Route path="/reports">
        <ProtectedRoute component={ReportsPage} />
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
