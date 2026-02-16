import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CheckCircle2, Clock, AlertCircle, XCircle, FileText, Package } from "lucide-react";

type StatusType = 
  | "success" 
  | "warning" 
  | "error" 
  | "info" 
  | "neutral" 
  | "draft"
  | "pending";

interface StatusBadgeProps {
  status: string;
  type?: StatusType;
  className?: string;
  showIcon?: boolean;
}

const TYPE_MAP: Record<string, StatusType> = {
  "finalized": "success",
  "approved": "success",
  "active": "success",
  "sent": "success",
  "delivered": "success",
  
  "pending": "warning",
  "needs receiving": "warning",
  "partially received": "warning",
  
  "rejected": "error",
  "deleted": "error",
  "overdue": "error",
  
  "draft": "draft",
  "open": "info",
};

const VARIANT_STYLES: Record<StatusType, string> = {
  success: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
  warning: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100",
  error: "bg-red-50 text-red-700 border-red-200 hover:bg-red-100",
  info: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
  neutral: "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100",
  draft: "bg-slate-100 text-slate-600 border-slate-200 border-dashed hover:bg-slate-200",
  pending: "bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100",
};

const ICONS: Record<StatusType, any> = {
  success: CheckCircle2,
  warning: Clock,
  error: XCircle,
  info: Package,
  neutral: FileText,
  draft: FileText,
  pending: Clock,
};

export function StatusBadge({ status, type, className, showIcon = true }: StatusBadgeProps) {
  const normalizedStatus = status.toLowerCase();
  const resolvedType = type || TYPE_MAP[normalizedStatus] || "neutral";
  const Icon = ICONS[resolvedType];

  return (
    <Badge 
      variant="outline" 
      className={cn(
        "gap-1.5 py-0.5 px-2.5 font-medium capitalize shadow-none transition-colors",
        VARIANT_STYLES[resolvedType],
        className
      )}
    >
      {showIcon && <Icon className="size-3.5" />}
      {status}
    </Badge>
  );
}
