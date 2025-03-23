import React, { useState, useCallback, useEffect } from "react";
import { Scheduler } from "@aldabil/react-scheduler";
import "./Scheduler.css";
import { Box, Typography, Button, Stack } from "@mui/material";
import { dummyEvents } from "../../data/dummyEvents";
import { ListAlt as ListAltIcon } from "@mui/icons-material";
import AgendaDialog from "../AgendaDialog/AgendaDialog";
import PropTypes from "prop-types";

const CustomScheduler = ({
  events,
  selectedColor,
  onEventAdd,
  onEventUpdate,
  onEventDelete,
  getSchedulerRef,
  currentView,
  onViewChange,
}) => {
  const [agendaOpen, setAgendaOpen] = useState(false);

  // Handle event creation
  const handleConfirm = async (event, action) => {
    if (action === "create") {
      const newEvent = {
        ...event,
        color: selectedColor,
      };
      onEventAdd(newEvent);
      return newEvent;
    }
    if (action === "edit") {
      onEventUpdate(event);
      return event;
    }
    return event;
  };

  // Handle event deletion
  const handleDelete = async (eventId) => {
    onEventDelete(eventId);
    return eventId;
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

  // Custom styles to hide Agenda tab
  const customStyles = `
    .rs__view_navigator button:nth-child(2) {
      display: none !important;
    }
    
    /* Make the time column fixed */
    .rs__time_indicator {
      position: sticky;
      left: 0;
      background: white;
      z-index: 1;
    }

    /* Ensure proper scrolling */
    .rs__scheduler {
      overflow: auto !important;
      height: 100% !important;
    }

    /* Keep headers visible while scrolling */
    .rs__header {
      position: sticky;
      top: 0;
      background: white;
      z-index: 2;
    }
  `;

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
      <style>{customStyles}</style>
      <Scheduler
        getSchedulerRef={getSchedulerRef}
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
        view={currentView.toLowerCase()}
        onViewChange={(newView) => onViewChange(newView)}
        navigation={{
          hidden: false,
        }}
        week={{
          weekDays: [0, 1, 2, 3, 4, 5, 6],
          weekStartOn: 0,
          startHour: 0,
          endHour: 24,
          step: 60,
          cellRenderer: ({ height, start, onClick, ...props }) => {
            return (
              <div
                style={{
                  height: 60,
                  ...props.style,
                }}
                onClick={onClick}
              />
            );
          },
        }}
        day={{
          startHour: 0,
          endHour: 24,
          step: 60,
          cellRenderer: ({ height, start, onClick, ...props }) => {
            return (
              <div
                style={{
                  height: 60,
                  ...props.style,
                }}
                onClick={onClick}
              />
            );
          },
        }}
        month={{
          weekDays: [0, 1, 2, 3, 4, 5, 6],
          weekStartOn: 0,
          startHour: 0,
          endHour: 24,
        }}
        toolbar={{
          dateFormat: {
            month: "long",
            year: "numeric",
            day: "numeric",
            weekday: "long",
          },
          showTodayButton: false,
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
          time: {
            am: "AM",
            pm: "PM",
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
    </Box>
  );
};

CustomScheduler.propTypes = {
  events: PropTypes.array.isRequired,
  selectedColor: PropTypes.string.isRequired,
  onEventAdd: PropTypes.func.isRequired,
  onEventUpdate: PropTypes.func.isRequired,
  onEventDelete: PropTypes.func.isRequired,
  getSchedulerRef: PropTypes.func.isRequired,
  currentView: PropTypes.string.isRequired,
  onViewChange: PropTypes.func.isRequired,
};

export default CustomScheduler;
