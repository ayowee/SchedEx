import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Typography,
} from "@mui/material";

const ColorPicker = ({ open, onClose, selectedColor, onColorChange }) => {
  const colors = [
    { name: "Blue", value: "#2563eb" },
    { name: "Red", value: "#dc2626" },
    { name: "Green", value: "#16a34a" },
    { name: "Purple", value: "#9333ea" },
    { name: "Orange", value: "#ea580c" },
    { name: "Pink", value: "#db2777" },
    { name: "Teal", value: "#0d9488" },
    { name: "Gray", value: "#4b5563" },
  ];

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Choose Event Color</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} className="p-4">
          {colors.map((color) => (
            <Grid item xs={3} key={color.value}>
              <button
                className={`w-full p-4 rounded-lg border-2 transition-all ${
                  selectedColor === color.value
                    ? "border-blue-500 scale-105"
                    : "border-transparent"
                }`}
                style={{ backgroundColor: color.value }}
                onClick={() => onColorChange(color.value)}
              >
                <div className="h-8" />
              </button>
              <Typography className="text-center mt-1" variant="caption">
                {color.name}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={onClose}>
          Apply
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ColorPicker;
