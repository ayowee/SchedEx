import React from "react";
import { Scheduler } from "@aldabil/react-scheduler";
import "./Scheduler.css";
import { Box } from "@mui/material";

const CustomScheduler = ({ selectedColor }) => {
  // Sample events data
  const events = [
    {
      event_id: 1,
      title: "Meeting",
      start: new Date("2024-02-15T10:00:00"),
      end: new Date("2024-02-15T12:00:00"),
    },
    {
      event_id: 2,
      title: "Conference",
      start: new Date("2024-02-16T09:00:00"),
      end: new Date("2024-02-16T11:00:00"),
    },
  ];

  // Use selectedColor when creating new events
  const handleEventCreate = (event) => {
    return {
      ...event,
      backgroundColor: selectedColor,
    };
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "calc(100vh - 64px)", // Subtract navbar height
        overflow: "auto",
      }}
    >
      {" "}
      {/* Subtract navbar height */}
      <div className="scheduler-container">
        <h2 className="text-2xl font-bold mb-4">February 2024</h2>
        <Scheduler
          events={events}
          view="week"
          selectedDate={new Date(2024, 1, 15)} // February 15, 2024
          onConfirm={(event, action) => {
            console.log("Event confirmed:", event, action);
          }}
          onDelete={(deletedId) => {
            console.log("Event deleted:", deletedId);
          }}
        />
      </div>
    </Box>
  );
};

export default CustomScheduler;
