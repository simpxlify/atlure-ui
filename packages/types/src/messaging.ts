import type { Coordinates, EntityId, IsoDateTime } from "./common.js";

export interface MessageThread {
  id: EntityId;
  participantIds: EntityId[];
  bookingId: EntityId | null;
  lastMessageAt: IsoDateTime;
  unreadCount: number;
}

export interface Message {
  id: EntityId;
  threadId: EntityId;
  senderId: EntityId;
  body: string;
  attachmentUrl: string | null;
  sentAt: IsoDateTime;
  readAt: IsoDateTime | null;
}

export type TrackingSessionStatus = "active" | "paused" | "ended";

export interface TrackingSession {
  id: EntityId;
  bookingId: EntityId;
  status: TrackingSessionStatus;
  startedAt: IsoDateTime;
  endedAt: IsoDateTime | null;
  distanceMeters: number;
}

export interface LocationPing {
  sessionId: EntityId;
  coordinates: Coordinates;
  recordedAt: IsoDateTime;
}

export type NotificationKind =
  | "booking-requested"
  | "booking-accepted"
  | "booking-declined"
  | "booking-cancelled"
  | "message-received"
  | "review-received"
  | "tracking-started"
  | "tracking-ended";

export interface Notification {
  id: EntityId;
  kind: NotificationKind;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: IsoDateTime;
  targetId: EntityId | null;
}
