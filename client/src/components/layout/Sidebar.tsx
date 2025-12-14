import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const [location, setLocation] = useLocation();

  const navItems = [
    { icon: "dashboard", label: "Dashboard", href: "/" },
    { icon: "group", label: "Users", href: "/users" },
    { icon: "verified_user", label: "Verification", href: "/verification" },
    { icon: "assessment", label: "Reports", href: "/reports" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("adminUser");
    setLocation("/login");
  };

  const adminUser = JSON.parse(localStorage.getItem("adminUser") || "{}");

  return (
    <aside className="flex-shrink-0 w-64 bg-white border-r border-border-light shadow-sm hidden lg:block">
      <div className="flex h-full min-h-[700px] flex-col justify-between p-6">
        <div className="flex flex-col gap-6">
          <Link href="/" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer" data-testid="link-logo-dashboard">
            <div 
              className="bg-gradient-to-br from-soft-peach to-muted-teal flex items-center justify-center rounded-full size-10 text-white font-bold" 
            >
              L
            </div>
            <div className="flex flex-col">
              <h1 className="text-text-dark text-lg font-bold leading-normal">Lahmee</h1>
              <p className="text-text-medium text-sm font-normal leading-normal">Admin Dashboard</p>
            </div>
          </Link>
          
          <nav className="flex flex-col gap-2 mt-4">
            {navItems.map((item) => {
              const isActive = location === item.href || (item.href !== '/' && location.startsWith(item.href));
              return (
                <Link 
                  key={item.href} 
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                    isActive 
                      ? "bg-soft-peach/70 text-text-dark font-semibold shadow-sm" 
                      : "text-text-medium hover:bg-gray-50 font-medium"
                  )}
                >
                  <span className={cn("material-symbols-outlined", isActive ? "text-text-dark" : "")}>
                    {item.icon}
                  </span>
                  <p className="text-sm">{item.label}</p>
                </Link>
              );
            })}
          </nav>
        </div>
        
        <div className="flex flex-col gap-1 border-t border-border-light pt-4">
          {adminUser?.name && (
            <div className="px-4 py-2 mb-2">
              <p className="text-xs text-text-medium">Logged in as</p>
              <p className="text-sm font-semibold text-text-dark">{adminUser.name}</p>
            </div>
          )}
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-text-medium hover:bg-red-50 hover:text-red-600 transition-colors w-full text-left"
            data-testid="button-logout"
          >
            <span className="material-symbols-outlined">logout</span>
            <p className="text-sm font-medium">Logout</p>
          </button>
        </div>
      </div>
    </aside>
  );
}
