import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: {
    value: number;
    label?: string;
  };
  className?: string;
  description?: string;
  borderColor?: "blue" | "teal" | "yellow" | "navy" | "red" | "default";
}

export function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  className, 
  description,
  borderColor = "default" 
}: StatCardProps) {

  const borderClasses = {
    blue: "border-b-4 border-b-brand-blue",
    teal: "border-b-4 border-b-brand-teal",
    yellow: "border-b-4 border-b-brand-yellow",
    navy: "border-b-4 border-b-brand-navy",
    red: "border-b-4 border-b-brand-red",
    default: "border-b-4 border-b-transparent" // or primary
  };

  const iconColors = {
    blue: "text-brand-blue",
    teal: "text-brand-teal",
    yellow: "text-brand-yellow",
    navy: "text-brand-navy",
    red: "text-brand-red",
    default: "text-primary"
  };

  return (
    <Card className={cn(
      "overflow-hidden shadow-sm hover:shadow-md transition-shadow border-none", 
      borderClasses[borderColor],
      className
    )}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-2">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
          {Icon && <Icon className={cn("h-5 w-5 opacity-80", iconColors[borderColor])} />}
        </div>
        
        <div className="flex items-end gap-2">
          <h3 className="text-3xl font-bold tracking-tight text-foreground">{value}</h3>
          
          {trend && (
             <div className="flex items-center mb-1.5">
               {trend.value > 0 ? (
                 <span className="text-emerald-600 font-bold text-sm bg-emerald-50 px-1.5 py-0.5 rounded">
                   +{trend.value}%
                 </span>
               ) : (
                 <span className="text-rose-600 font-bold text-sm bg-rose-50 px-1.5 py-0.5 rounded">
                   {trend.value}%
                 </span>
               )}
             </div>
          )}
        </div>
        
        {description && (
          <p className="text-xs text-muted-foreground mt-2">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
