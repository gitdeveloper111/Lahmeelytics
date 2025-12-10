import { Link, useLocation } from "wouter";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const [location] = useLocation();

  const navItems = [
    { icon: "dashboard", label: "Dashboard", href: "/" },
    { icon: "group", label: "Users", href: "/users" },
    { icon: "verified_user", label: "Verification", href: "/verification" },
    { icon: "assessment", label: "Reports", href: "/reports" },
    { icon: "settings", label: "Settings", href: "/settings" },
  ];

  return (
    <aside className="flex-shrink-0 w-64 bg-white border-r border-border-light shadow-sm hidden lg:block">
      <div className="flex h-full min-h-[700px] flex-col justify-between p-6">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3 p-2">
            <div 
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10" 
              style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD3Kjird3aBmk8C0PGDghs6tknyUp8mIDl5ZAeru2Iy4QxvIKwToHiRHFzGjE6ohQzp58i7O4b1RlaTZMiy38RPG079yUHhG6kwsLCVpQHPNbYEure4uoa_bPbWrr2tjxQeh1sePKfMgagBE5Gh6kMIBT3Uv7krPRG7y4lw_maLt9MnamIHzTNElEyEu4QiTKm78EpQoqoIBUYQ-F7s4tI7gYC068imyw--kFnrQ2HgLvOAjRNpk0Ge_rSpwodT_5MJFfuUYYj3g1c3")' }}
            ></div>
            <div className="flex flex-col">
              <h1 className="text-text-dark text-lg font-bold leading-normal">Lahmee</h1>
              <p className="text-text-medium text-sm font-normal leading-normal">Growth Story</p>
            </div>
          </div>
          
          <nav className="flex flex-col gap-2 mt-4">
            {navItems.map((item) => {
              const isActive = location === item.href || (item.href !== '/' && location.startsWith(item.href));
              return (
                <Link key={item.href} href={item.href}>
                  <a className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                    isActive 
                      ? "bg-soft-peach/70 text-text-dark font-semibold shadow-sm" 
                      : "text-text-medium hover:bg-gray-50 font-medium"
                  )}>
                    <span className={cn("material-symbols-outlined", isActive ? "text-text-dark" : "")}>
                      {item.icon}
                    </span>
                    <p className="text-sm">{item.label}</p>
                  </a>
                </Link>
              );
            })}
          </nav>
        </div>
        
        <div className="flex flex-col gap-1 border-t border-border-light pt-4">
          <a className="flex items-center gap-3 px-4 py-3 rounded-lg text-text-medium hover:bg-gray-50 transition-colors" href="#">
            <span className="material-symbols-outlined">help</span>
            <p className="text-sm font-medium">Support</p>
          </a>
          <a className="flex items-center gap-3 px-4 py-3 rounded-lg text-text-medium hover:bg-gray-50 transition-colors" href="#">
            <span className="material-symbols-outlined">logout</span>
            <p className="text-sm font-medium">Logout</p>
          </a>
        </div>
      </div>
    </aside>
  );
}
