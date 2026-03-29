export interface Ticket {
  id: string
  title: string
  description: string
  status: "open" | "in-progress" | "resolved"
  priority: "low" | "medium" | "high"
  createdAt: string
  updatedAt: string
  assignee: string
}
