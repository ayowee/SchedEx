export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  color: string;
  location?: string;
  attendees?: string[];
}
