import React, { useState } from "react";
import { Scheduler } from "@aldabil/react-scheduler";
import "./Scheduler.css";
import { Box, Typography } from "@mui/material";
import { dummyEvents } from "../../data/dummyEvents";

const CustomScheduler = ({ selectedColor }) => {
  const [events, setEvents] = useState(
    dummyEvents.map((event) => ({
      event_id: event.id,
      title: event.title,
      start: new Date(event.start),
      end: new Date(event.end),
      description: event.description,
      color: event.color,
      location: event.location,
    }))
  );

  // Handle event creation
  const handleConfirm = async (event, action) => {
    if (action === "create") {
      const newEvent = {
        event_id: Date.now(),
        title: event.title,
        start: event.start,
        end: event.end,
        description: event.description || "",
        color: selectedColor,
        location: event.location || "",
      };
      setEvents([...events, newEvent]);
      return newEvent;
    }

    if (action === "edit") {
      const updatedEvents = events.map((e) =>
        e.event_id === event.event_id ? event : e
      );
      setEvents(updatedEvents);
      return event;
    }

    return event;
  };

  // Handle event deletion
  const handleDelete = async (deletedId) => {
    setEvents(events.filter((event) => event.event_id !== deletedId));
    return deletedId;
  };

  // Custom fields for event form
  const customFields = [
    {
      name: "description",
      type: "textarea",
      default: "",
      config: {
        label: "Description",
        multiline: true,
        rows: 4,
      },
    },
    {
      name: "location",
      type: "input",
      default: "",
      config: {
        label: "Location",
        required: false,
      },
    },
  ];

  return (
    <Box
      sx={{
        width: "100%",
        height: "calc(100vh - 64px)", // Subtract navbar height
        overflow: "auto",
        "& .rs__event": {
          backgroundColor: (event) => event.color || selectedColor,
          borderRadius: "4px",
          "&:hover": {
            opacity: 0.9,
          },
        },
      }}
    >
      {" "}
      {/* Subtract navbar height */}
      <div className="scheduler-container">
        <h2 className="text-2xl font-bold mb-4">February 2024</h2>
        <Scheduler
          events={events}
          onConfirm={handleConfirm}
          onDelete={handleDelete}
          customFields={customFields}
          viewerExtraComponent={(fields, event) => (
            <Box sx={{ p: 2 }}>
              {event.description && (
                <Typography variant="body2" sx={{ mb: 1 }}>
                  {event.description}
                </Typography>
              )}
              {event.location && (
                <Typography variant="body2" color="textSecondary">
                  📍 {event.location}
                </Typography>
              )}
            </Box>
          )}
          fields={[
            {
              name: "color",
              type: "hidden",
              default: selectedColor,
            },
          ]}
          month={{
            weekDays: [0, 1, 2, 3, 4, 5, 6],
            weekStartOn: 0,
            startHour: 9,
            endHour: 17,
          }}
          week={{
            weekDays: [0, 1, 2, 3, 4, 5, 6],
            weekStartOn: 0,
            startHour: 9,
            endHour: 17,
          }}
          day={{
            startHour: 9,
            endHour: 17,
          }}
          translations={{
            navigation: {
              month: "Month",
              week: "Week",
              day: "Day",
              today: "Today",
            },
          }}
        />
      </div>
    </Box>
  );
};

export default CustomScheduler;
