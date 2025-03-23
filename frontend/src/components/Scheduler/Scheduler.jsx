import React, { useState, useCallback, useEffect } from "react";
import { Scheduler } from "@aldabil/react-scheduler";
import "./Scheduler.css";
import {
  Box,
  Typography,
  Button,
  Stack,
  TextField,
  InputAdornment,
  MenuItem,
} from "@mui/material";
import { dummyEvents } from "../../data/dummyEvents";
import {
  ListAlt as ListAltIcon,
  LocationOn as LocationIcon,
  Palette as PaletteIcon,
} from "@mui/icons-material";
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

  // Predefined color options
  const colorOptions = [
    { value: "#2563eb", label: "Blue" },
    { value: "#dc2626", label: "Red" },
    { value: "#16a34a", label: "Green" },
    { value: "#9333ea", label: "Purple" },
    { value: "#ea580c", label: "Orange" },
    { value: "#db2777", label: "Pink" },
  ];

  const handleConfirm = async (event, action) => {
    try {
      if (action === "create") {
        const newEvent = {
          ...event,
          event_id: Date.now(),
          color: event.color || selectedColor,
        };
        onEventAdd(newEvent);
        return newEvent;
      }

      if (action === "edit") {
        onEventUpdate(event);
        return event;
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (eventId) => {
    onEventDelete(eventId);
    return eventId;
  };

  const fields = [
    {
      name: "title",
      type: "input",
      config: {
        label: "Event Title",
        required: true,
        variant: "outlined",
        fullWidth: true,
        sx: { mb: 2 },
      },
    },
    {
      name: "description",
      type: "input",
      config: {
        label: "Description",
        multiline: true,
        rows: 4,
        variant: "outlined",
        fullWidth: true,
        sx: { mb: 2 },
      },
    },
    {
      name: "location",
      type: "input",
      config: {
        label: "Location",
        variant: "outlined",
        fullWidth: true,
        InputProps: {
          startAdornment: (
            <InputAdornment position="start">
              <LocationIcon />
            </InputAdornment>
          ),
        },
        sx: { mb: 2 },
      },
    },
    {
      name: "color",
      type: "select",
      default: selectedColor,
      config: {
        label: "Color",
        variant: "outlined",
        fullWidth: true,
        select: true,
        InputProps: {
          startAdornment: (
            <InputAdornment position="start">
              <PaletteIcon />
            </InputAdornment>
          ),
        },
        sx: { mb: 2 },
      },
      options: colorOptions.map((color) => ({
        id: color.value,
        text: color.label,
        value: color.value,
        render: () => (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                backgroundColor: color.value,
              }}
            />
            <Typography>{color.label}</Typography>
          </Box>
        ),
      })),
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
        view={currentView.toLowerCase()}
        onViewChange={(newView) => onViewChange(newView)}
        fields={fields}
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
          event: {
            title: "Title",
            start: "Start",
            end: "End",
            description: "Description",
            location: "Location",
          },
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
