import React, { useState } from "react";
import { Scheduler } from "@aldabil/react-scheduler";
import "./Scheduler.css";
import { Box, Typography, Button } from "@mui/material";
import { dummyEvents } from "../../data/dummyEvents";
import { ListAlt as ListAltIcon } from "@mui/icons-material";
import AgendaDialog from "../AgendaDialog/AgendaDialog";

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

  const [agendaOpen, setAgendaOpen] = useState(false);

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
        height: "calc(100vh - 64px)",
        width: "100%",
        position: "relative",
        "& .rs__event": {
          backgroundColor: (event) => event.color || selectedColor,
          borderRadius: "4px",
          "&:hover": {
            opacity: 0.9,
          },
        },
      }}
    >
      {/* Agenda Button */}
      <Button
        variant="contained"
        startIcon={<ListAltIcon />}
        sx={{
          position: "absolute",
          top: 16,
          right: 16,
          zIndex: 1000,
        }}
        onClick={() => setAgendaOpen(true)}
      >
        View Agenda
      </Button>

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
        view="week"
        selectedDate={new Date()}
        month={{
          weekDays: [0, 1, 2, 3, 4, 5, 6],
          weekStartOn: 0,
          startHour: 9,
          endHour: 17,
          navigation: true,
          disableGoToDay: false,
        }}
        week={{
          weekDays: [0, 1, 2, 3, 4, 5, 6],
          weekStartOn: 0,
          startHour: 9,
          endHour: 17,
          step: 60,
          navigation: true,
        }}
        day={{
          startHour: 9,
          endHour: 17,
          step: 60,
          navigation: true,
        }}
        navigationPickerProps={{
          shouldDisableDate: false,
          variant: "inline",
        }}
        translations={{
          navigation: {
            month: "Month",
            week: "Week",
            day: "Day",
            today: "Today",
          },
          form: {
            addTitle: "Add Event",
            editTitle: "Edit Event",
            confirm: "Confirm",
            delete: "Delete",
            cancel: "Cancel",
          },
          agenda: {
            time: "Time",
            event: "Event",
          },
        }}
        hourFormat="12"
        draggable={true}
        editable={true}
        deletable={true}
        resources={[]}
        resourceFields={{
          idField: "event_id",
          textField: "title",
          subTextField: "description",
          avatarField: "avatar",
          colorField: "color",
        }}
        recourseHeaderComponent={(resource) => {
          return (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography>{resource.title}</Typography>
            </Box>
          );
        }}
        defaultView="week"
        toolbarProps={{
          showDatePicker: true,
          showTodayButton: true,
          showViewSwitcher: true,
        }}
      />

      {/* Agenda Dialog */}
      {agendaOpen && (
        <AgendaDialog
          open={agendaOpen}
          onClose={() => setAgendaOpen(false)}
          events={events}
        />
      )}
    </Box>
  );
};

export default CustomScheduler;
