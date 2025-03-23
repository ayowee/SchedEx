import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from "@mui/material";
import { Close as CloseIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";

const EventModal = ({
  open,
  onClose,
  event,
  onSave,
  onDelete,
  selectedColor,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    start: new Date(),
    end: new Date(),
    color: selectedColor,
    location: "",
    attendees: [],
  });

  useEffect(() => {
    if (event) {
      setFormData(event);
    } else {
      setFormData({
        title: "",
        description: "",
        start: new Date(),
        end: new Date(),
        color: selectedColor,
        location: "",
        attendees: [],
      });
    }
  }, [event, selectedColor]);

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleDateChange = (field) => (date) => {
    setFormData({ ...formData, [field]: date });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {event ? "Edit Event" : "Create Event"}
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Title"
              value={formData.title}
              onChange={handleChange("title")}
              required
            />

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                label="Start Time"
                value={formData.start}
                onChange={handleDateChange("start")}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
              <DateTimePicker
                label="End Time"
                value={formData.end}
                onChange={handleDateChange("end")}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>

            <TextField
              fullWidth
              label="Location"
              value={formData.location}
              onChange={handleChange("location")}
            />

            <TextField
              fullWidth
              multiline
              rows={3}
              label="Description"
              value={formData.description}
              onChange={handleChange("description")}
            />

            <FormControl fullWidth>
              <InputLabel>Color</InputLabel>
              <Select
                value={formData.color}
                onChange={handleChange("color")}
                label="Color"
              >
                <MenuItem value="#2563eb">Blue</MenuItem>
                <MenuItem value="#dc2626">Red</MenuItem>
                <MenuItem value="#16a34a">Green</MenuItem>
                <MenuItem value="#9333ea">Purple</MenuItem>
                <MenuItem value="#ea580c">Orange</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          {event && (
            <Button
              color="error"
              onClick={() => onDelete(event.id)}
              startIcon={<DeleteIcon />}
            >
              Delete
            </Button>
          )}
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            {event ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EventModal;
