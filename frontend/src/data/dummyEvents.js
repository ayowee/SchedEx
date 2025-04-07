export const dummyEvents = [
  {
    id: 1,
    title: "Team Meeting",
    description: "Weekly team sync-up discussion about ongoing projects",
    start: new Date(new Date().setHours(10, 0, 0, 0)),
    end: new Date(new Date().setHours(11, 30, 0, 0)),
    color: "#2563eb",
    location: "Conference Room A",
  },
  {
    id: 2,
    title: "Project Review",
    description: "Q1 project status review with stakeholders",
    start: new Date(new Date().setHours(14, 0, 0, 0)),
    end: new Date(new Date().setHours(15, 30, 0, 0)),
    color: "#dc2626",
    location: "Virtual Meeting Room",
  },
  {
    id: 3,
    title: "Client Meeting",
    description: "Discussion about new requirements",
    start: new Date(new Date().setDate(new Date().getDate() + 1)),
    end: new Date(new Date().setDate(new Date().getDate() + 1)),
    color: "#16a34a",
    location: "Client Office",
  },
];
