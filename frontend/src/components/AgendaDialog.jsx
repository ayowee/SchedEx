import React, { useState, useCallback, useEffect, memo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Alert,
  Snackbar,
} from "@mui/material";
import { format, isValid, parseISO } from "date-fns";

// Add a utility function to check if a date is valid
const isValidDate = (date) => {
  return date instanceof Date && !isNaN(date.getTime());
};

const AgendaDialog = ({ event, onClose, onConfirm }) => {
  // Alert state
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  // Initialize form state once
  const [formData, setFormData] = useState(() => {
    const defaultStart = event?.start ? new Date(event.start) : new Date();
    const defaultEnd = event?.end
      ? new Date(event.end)
      : new Date(defaultStart.getTime() + 3600000);

    return {
      title: event?.title || "",
      description: event?.description || "",
      start: defaultStart,
      end: defaultEnd,
      location: event?.location || "",
      color: event?.color || "#3174ad",
    };
  });

  // Separate state for form validation
  const [errors, setErrors] = useState({});

  // Memoize the date formatter
  const formatDateForInput = useCallback((date) => {
    try {
      return date ? format(new Date(date), "yyyy-MM-dd'T'HH:mm") : "";
    } catch (error) {
      console.error("Date formatting error:", error);
      return "";
    }
  }, []);

  // Handle input changes with validation
  const handleInputChange = useCallback((field, value) => {
    setFormData((prev) => {
      const newData = { ...prev };

      if (field === "start" || field === "end") {
        try {
          const dateValue = new Date(value);
          if (!isValid(dateValue)) {
            setErrors((prev) => ({ ...prev, [field]: "Invalid date" }));
            return newData;
          }

          if (field === "start" && dateValue >= newData.end) {
            newData.end = new Date(dateValue.getTime() + 3600000);
          } else if (field === "end" && dateValue <= newData.start) {
            setErrors((prev) => ({
              ...prev,
              end: "End time must be after start time",
            }));
            return newData;
          }

          newData[field] = dateValue;
          setErrors((prev) => ({ ...prev, [field]: null }));
        } catch (error) {
          setErrors((prev) => ({ ...prev, [field]: "Invalid date format" }));
          return newData;
        }
      } else {
        newData[field] = value;
      }

      return newData;
    });
  }, []);

  // Update form when event prop changes
  useEffect(() => {
    if (event) {
      const start = event.start ? new Date(event.start) : new Date();
      const end = event.end
        ? new Date(event.end)
        : new Date(start.getTime() + 3600000);

      setFormData({
        title: event.title || "",
        description: event.description || "",
        start,
        end,
        location: event.location || "",
        color: event.color || "#3174ad",
      });
    }
  }, [event]);

  const handleSubmit = useCallback(
    (e) => {
      e?.preventDefault();

      // Validate before submitting
      const validationErrors = {};
      if (!formData.title) validationErrors.title = "Title is required";
      if (!isValid(formData.start))
        validationErrors.start = "Invalid start date";
      if (!isValid(formData.end)) validationErrors.end = "Invalid end date";
      if (formData.end <= formData.start)
        validationErrors.end = "End time must be after start time";

      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      onConfirm(formData);
    },
    [formData, onConfirm]
  );

  const handleCloseAlert = () => {
    setAlert((prev) => ({ ...prev, open: false }));
  };

  return (
    <>
      <Dialog open={true} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>{event ? "Edit Event" : "Create Event"}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              error={!!errors.title}
              helperText={errors.title}
              fullWidth
              margin="normal"
            />

            <TextField
              label="Start Time"
              type="datetime-local"
              value={formatDateForInput(formData.start)}
              onChange={(e) => handleInputChange("start", e.target.value)}
              error={!!errors.start}
              helperText={errors.start}
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              label="End Time"
              type="datetime-local"
              value={formatDateForInput(formData.end)}
              onChange={(e) => handleInputChange("end", e.target.value)}
              error={!!errors.end}
              helperText={errors.end}
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              label="Description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              multiline
              rows={4}
              fullWidth
              margin="normal"
            />

            <TextField
              label="Location"
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              fullWidth
              margin="normal"
            />

            <TextField
              label="Color"
              type="color"
              value={formData.color}
              onChange={(e) => handleInputChange("color", e.target.value)}
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={Object.keys(errors).length > 0}
          >
            {event ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
      >
        <Alert
          onClose={handleCloseAlert}
          severity={alert.severity}
          sx={{ width: "100%" }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default memo(AgendaDialog);
