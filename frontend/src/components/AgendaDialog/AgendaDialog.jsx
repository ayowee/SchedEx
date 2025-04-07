import React, { useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
  Box,
} from "@mui/material";
import {
  Close as CloseIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";
import { format } from "date-fns";
import { useReactToPrint } from "react-to-print";

const AgendaDialog = ({ open, onClose, events }) => {
  const printRef = useRef(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "Schedule_Agenda",
    onAfterPrint: () => console.log("Printing completed"),
  });

  // Sort events by date
  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.start) - new Date(b.start)
  );

  // Group events by date
  const groupedEvents = sortedEvents.reduce((groups, event) => {
    const date = format(new Date(event.start), "yyyy-MM-dd");
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(event);
    return groups;
  }, {});

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          bgcolor: "primary.main",
          color: "white",
        }}
      >
        Schedule Agenda
        <Box>
          <IconButton onClick={handlePrint} sx={{ color: "white", mr: 1 }}>
            <DownloadIcon />
          </IconButton>
          <IconButton onClick={onClose} sx={{ color: "white" }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <div ref={printRef}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Schedule Overview
            </Typography>

            {Object.entries(groupedEvents).map(([date, dayEvents]) => (
              <Box key={date} sx={{ mb: 4 }}>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 2,
                    pb: 1,
                    borderBottom: "2px solid",
                    borderColor: "primary.main",
                  }}
                >
                  {format(new Date(date), "EEEE, MMMM d, yyyy")}
                </Typography>

                <TableContainer component={Paper} elevation={1}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell width="20%">Time</TableCell>
                        <TableCell width="30%">Event</TableCell>
                        <TableCell width="30%">Description</TableCell>
                        <TableCell width="20%">Location</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {dayEvents.map((event) => (
                        <TableRow key={event.event_id}>
                          <TableCell>
                            {format(new Date(event.start), "h:mm a")} -{" "}
                            {format(new Date(event.end), "h:mm a")}
                          </TableCell>
                          <TableCell>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <Box
                                sx={{
                                  width: 12,
                                  height: 12,
                                  borderRadius: "50%",
                                  bgcolor: event.color,
                                }}
                              />
                              {event.title}
                            </Box>
                          </TableCell>
                          <TableCell>{event.description || "-"}</TableCell>
                          <TableCell>{event.location || "-"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            ))}
          </Box>
        </div>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose}>Close</Button>
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={handlePrint}
        >
          Download PDF
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AgendaDialog;
