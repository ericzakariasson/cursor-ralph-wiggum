export type Priority = "urgent" | "high" | "medium" | "low" | "none";

export type Status = "backlog" | "todo" | "in_progress" | "done";

export interface Issue {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  createdAt: string;
  updatedAt: string;
}

export const STATUS_CONFIG: Record<Status, { label: string; color: string }> = {
  backlog: { label: "Backlog", color: "#6b7280" },
  todo: { label: "Todo", color: "#3b82f6" },
  in_progress: { label: "In Progress", color: "#f59e0b" },
  done: { label: "Done", color: "#10b981" },
};

export const PRIORITY_CONFIG: Record<
  Priority,
  { label: string; color: string; icon: string }
> = {
  urgent: { label: "Urgent", color: "#ef4444", icon: "🔴" },
  high: { label: "High", color: "#f97316", icon: "🟠" },
  medium: { label: "Medium", color: "#eab308", icon: "🟡" },
  low: { label: "Low", color: "#22c55e", icon: "🟢" },
  none: { label: "No Priority", color: "#6b7280", icon: "⚪" },
};

export const STATUSES: Status[] = ["backlog", "todo", "in_progress", "done"];
export const PRIORITIES: Priority[] = [
  "urgent",
  "high",
  "medium",
  "low",
  "none",
];
