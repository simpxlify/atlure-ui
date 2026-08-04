import type { EntityId, IsoDateTime } from "./common.js";

export interface HelpArticle {
  id: EntityId;
  slug: string;
  title: string;
  category: string;
  body: string;
  viewCount: number;
  helpfulCount: number;
}

export type SupportTicketStatus = "open" | "in-progress" | "resolved" | "closed";

export type SupportTicketPriority = "low" | "medium" | "high" | "urgent";

export interface SupportTicket {
  id: EntityId;
  title: string;
  status: SupportTicketStatus;
  priority: SupportTicketPriority;
  category: string;
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
  messageCount: number;
}

export interface Bookmark {
  id: EntityId;
  userId: EntityId;
  sitterId: EntityId;
  createdAt: IsoDateTime;
}
