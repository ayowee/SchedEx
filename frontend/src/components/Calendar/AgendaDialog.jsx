import React, { useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
} from "@mui/material";
import { useReactToPrint } from "react-to-print";

const AgendaDialog = ({ open, onClose }) => {
  const printRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: "Schedule_Agenda",
    onAfterPrint: () => console.log("Printed successfully"),
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Schedule Agenda</DialogTitle>
      <DialogContent>
        <Box ref={printRef}>{/* Agenda content */}</Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button onClick={handlePrint} variant="contained">
          Download PDF
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AgendaDialog;
