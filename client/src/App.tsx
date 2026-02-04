import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import DashboardLayout from "./components/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import ResourcesView from "./pages/ResourcesView";
import UsersManagement from "./pages/admin/Users";
import EventsManagement from "./pages/admin/Events";
import NewsManagement from "./pages/admin/News";
import ResourcesManagement from "./pages/admin/Resources";

function Router() {
  return (
    <DashboardLayout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/resources" component={ResourcesView} />
        <Route path="/admin/users" component={UsersManagement} />
        <Route path="/admin/events" component={EventsManagement} />
        <Route path="/admin/news" component={NewsManagement} />
        <Route path="/admin/resources" component={ResourcesManagement} />
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </DashboardLayout>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
